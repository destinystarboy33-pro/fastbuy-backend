import Payment from "../models/paymentModel.js";
import { foodItems } from "../data/products.js";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto"

const initializePayment = async (req, res) => {
     try {
  const { productId } = req.body;
  // const FRONTEND_URL = process.env.

  const product = foodItems.find((product) => {
    return product.id === Number(productId);
  });

  console.log(product, req.user.email);
 
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",

      {
        email: req.user.email,
        amount: product.price * 100,
        callback_url: `${process.env.FRONTEND_URL}/verify/payment`,
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    await Payment.create({
      user: req.user.id,
      productId: product.id,
      productName: product.name,
      amount: product.price,
      reference: response.data.data.reference,
      status: "pending"
    })

    res.status(StatusCodes.CREATED).json({
        message: response.data.message,
        data:{
           authorization_url: response.data.data.authorization_url,
            reference: response.data.data.reference

        }
    })

    console.log(response.data);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "opps! something went wrong",
      status: false,
      error: message.error
    })
  }
};


const VerifyPayment = async(req, res) =>{
  try{
    console.log(req.params)

    const {reference} = req.params
    const response = await axios.get(` https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: ` Bearer ${process.env.PAYSTACK_SECRET_KEY}`}
      }
    )
      if (response.data.data.status === "success") {
        
        await Payment.findOneAndUpdate({reference},{status: "failed"})
       
           res.status(StatusCodes.OK).json({
             message: response.data.data.message,
             status: true,
             data: {
              reference:response.data.data.reference,
              status: response.data.data.status
           }
           })
      } else{
            
        await Payment.findOneAndUpdate({reference},{status: "failed"}
        )
       
           res.status(StatusCodes.BAD_REQUEST).json({
             message: response.data.data.message,
             status: true,
             data: {
              reference:response.data.data.reference,
              status: response.data.data.status
           }
           })
      }

    console.log(response.data)
  }catch(error){
    console.log(error)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "opps! something went wrong",
      status: false,
      error: message.error
    })
  }
}


const paymentWebhook = async(req, res) =>{

  console.log(req.headers)
  try {
      const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(req.rawBody).digest('hex');
    if (hash == req.headers['x-paystack-signature']){

    }
  } catch (error) {
    console.log(error)
  }
}

export { initializePayment, VerifyPayment, paymentWebhook };
