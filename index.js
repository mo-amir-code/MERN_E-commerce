require('dotenv').config()
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
const productRouter = require("./Router/Product");
const cartRouter = require("./Router/Cart");
const OrderRouter = require("./Router/Order");
const authRouter = require("./Router/Auth");
const userRouter = require("./Router/User");
const categoriesRouter = require("./Router/Categories");
const brandsRouter = require("./Router/Brands");
const sizesRouter = require("./Router/Sizes");
const cors = require("cors");
const path = require('path')

const model = require("./Model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./Services/comman");
const User = model.User;
const orderModel = require('./Model/Order')
const Order = orderModel.Order

const opts = {};
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = process.env.JWT_SECRET_KEY;

const server = express();
server.use(cookieParser())
server.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});
server.use(cors({ exposedHeaders: ["X-Total-Count"] }));

main().catch((err) =>
  console.log(err, "Error Occured With Mongo Database Connection")
);
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database connected..!");
}

//middlewares

server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

server.use(express.static(path.resolve(__dirname, 'build')))
server.use("/products", isAuth(), productRouter);
server.use("/cart", isAuth(), cartRouter);
server.use("/order", isAuth(), OrderRouter);
server.use("/auth", authRouter);
server.use("/user", isAuth(), userRouter);
server.use("/categories", isAuth(), categoriesRouter);
server.use("/brands", isAuth(), brandsRouter);
server.use("/sizes", isAuth(), sizesRouter);
//this line we add to make react router work in case of other router doesn't match
server.get("*", (req, res) => res.sendFile(path.resolve('build', 'index.html')))

// Passport strategies
passport.use("local",
  new LocalStrategy({usernameField:"email"}, async function (email, password, done) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return done(null, false, { message: "no such user email" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "some creadentials error" });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY)
          done(null, {id:user.id, role:user.role, token:token});
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

passport.use('jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try{
        const user = await User.findById(jwt_payload.id)
            if (user) {
                return done(null, sanitizeUser(user));
            } else {
                return done(null, false);
            }
    }catch(err){
        done(err, false)
    }
    })
);

// this creates session variables req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this created session variables req.user on being called from authorised request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Payments
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderIds } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
      id:orderIds[0]
    }
  });

  
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// End Payments


// webhook
const endpoint = process.env.ENDPOINT_SECRET
server.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  // const body = JSON.stringify(request.body)

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpoint);
  } catch (err) {
    response.status(400).json(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch(event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      try{
          const order = await Order.findById(paymentIntentSucceeded.metadata)
          order.paymentStatus = "Recieved"
          await order.save()
      }catch(error){
        console.log(error)
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


server.listen(process.env.PORT, () => {
  console.log("Server started...!");
});
