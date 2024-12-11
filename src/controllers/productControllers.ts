import { Request, Response } from "express";
import { Prisma } from "./authControllers";

//fetch all availble items from the database
async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await Prisma.products.findMany();
    if (products) {
      res.status(200).json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(501).json(error.stack);
  }
}

//returns a single item matched with the provided product id
async function findProduct(req: Request, res: Response) {
  const productID = String(req.query.product);
  try {
    const product = await Prisma.products.findUnique({
      where: { id: productID },
    });

    //returns an error message back to client if no item is found to match the provided product id
    if (!product) {
      res.status(404).json({ error: "product does not exist, not available!" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: error.stack });
  }
}

// function upadates item based on the provided id
async function updateProduct(req: Request, res: Response) {
  //id is from params of patch request
  const { id } = req.params;
  const { name, price, desc, isNew } = req.body;
  try {
    const updatedProduct = await Prisma.products.update({
      where: { id },
      data: {
        name,
        price,
        desc,
        isNew,
      },
    });
    //sends back a ok response to client if update operation is succesfull
    if (updatedProduct) {
      res.status(200).json({
        message: "product data updated succesfully",
        product: updatedProduct,
      });
    } else
      res
        .status(500)
        .json({ error: "unable to update product, something went wrong" });
    console.log();
  } catch (error) {
    console.log(error.stack);
    res
      .status(501)
      .json({ error: "something went wrong, internal server error" });
  }
}
// this function  creates and store new product items to the product table
async function addProduct(req: Request, res: Response) {
  const { name, price } = req.body;
  try {
    const newProduct = await Prisma.products.create({
      data: {
        name,
        price,
      },
    });
    if (newProduct) {
      res.status(201).json({
        message: "new product added succesfully",
        product: newProduct,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: error.stack });
  }
}

// function to delete product item from db with provided item id
async function removeProduct(req: Request, res: Response) {
  //finds the item to delete with the provided product ID
  const productID = String(req.query.product);
  try {
    const itemToDelete = await Prisma.products.delete({
      where: {
        id: productID,
      },
    });
    if (itemToDelete) {
      res.status(200).json({
        message: "item deleted succesfully!",
      });
      return;
    }
    res.status(400).json({ error: "something went wrong" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
    return;
  }
}

export {
  addProduct,
  removeProduct,
  findProduct,
  getAllProducts,
  updateProduct,
};