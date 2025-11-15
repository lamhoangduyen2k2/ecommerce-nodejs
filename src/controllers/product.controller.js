"use strict";

import { SuccessResponse } from "../core/success.response.js";
import ProductService from "../services/product.service.js";

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product success!",
      metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product success!",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish Product success!",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Draft success!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

   getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Publish success!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Search Products success!",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list All Products success!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Products by Id success!",
      metadata: await ProductService.findProduct({ product_id: req.params.product_id }),
    }).send(res);
  }
}

export default new ProductController();
