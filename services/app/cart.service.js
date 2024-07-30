/*
 * Summary:     event.services file for handling all event related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const User = require("../../database/models").tbl_user;
const Event = require("../../database/models").tbl_event;
const Service = require("../../database/models").tbl_service;
const Category = require("../../database/models").tbl_category;
const EventTicket = require("../../database/models").tbl_event_ticket;
const EventMedia = require("../../database/models").tbl_event_media;
const ServiceBooking = require("../../database/models").tbl_service_booking;
const Cart = require("../../database/models").tbl_cart;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");
const imageupload = require("../../middleware/multer_aws_upload");
const imageDelete = require("../../middleware/multer_aws_delete");

module.exports = {
  /* add */
  async add(req, res) {
    let { event_ticket_id, service_id, booking_id, type, quantity, total, customer_id } = req.body;
    if (type === "event") {
      console.log("The type is ");
      console.log(type)
      console.log(event_ticket_id)
      console.log(quantity)
      console.log(total)
      console.log(req.body.event_id)
      let add_cart = await Cart.create({
        event_ticket_id: event_ticket_id,
        type: type,
        quantity: quantity,
        total: total,
        user_id: req.user_id,
        event_id: req.body.event_id,
      });
      return add_cart;
    } else {
      let add_cart = await Cart.create({
        service_id: service_id,
        service_booking_id: booking_id,
        type: type,
        quantity: quantity,
        total: total,
        user_id: customer_id,
        start_date: req.body.start_date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
      });
      return add_cart;
    }
  },

  //list
  // async list(req, res) {
  //   let { page, type } = req.body;
  //   const offset = (page - 1) * constant.LIMIT;
  //   const limit = constant.LIMIT;
  //   let today_date = new Date();

  //   let where_obj = {
  //     user_id: req.user_id,
  //     type: type
  //   };
  //   // let find_cart = await Cart.findAndCountAll({
  //   //   where: where_obj,
  //   // });
  //   let find_cart = await Cart.findAndCountAll({
  //     where: where_obj,
  //     include: [
  //       // {
  //       //   model: EventTicket,
  //       //   as: "ticket_detail",
  //       //   required: true,
  //       //   attributes: [
  //       //     "event_ticket_id",
  //       //     "event_id",
  //       //     "type",
  //       //     "rate",
  //       //     "quantity",
  //       //   ],
  //       //   include: [
  //       //     {
  //       //       model: Event,
  //       //       as: "event",

  //       //       attributes: [
  //       //         "event_id",
  //       //         "user_id",
  //       //         "name",
  //       //         "address",
  //       //         "start_date",
  //       //         "end_date",
  //       //         "start_time",
  //       //         "end_time",
  //       //       ],
  //       //       include: [
  //       //         {
  //       //           model: EventMedia,
  //       //           as: "media",
  //       //           attributes: {
  //       //             exclude: ["createdAt", "updatedAt"],
  //       //           },
  //       //         },
  //       //         {
  //       //           model: User,
  //       //           as: "user",
  //       //           attributes: [
  //       //             "user_id",
  //       //             "full_name",
  //       //             "email",
  //       //             "country_code",
  //       //             "phone_number",
  //       //             "profile_image",
  //       //             "stripe_account_id",
  //       //             "stripe_customer_id",
  //       //           ],
  //       //         },
  //       //       ],
  //       //     },
  //       //     {
  //       //       model: Event,
  //       //       as: "event",
  //       //       // attributes: ["category_id", "category_name"],
  //       //       where: {
  //       //         start_date: {
  //       //           [Op.gte]: `${today_date.getFullYear()}-${today_date.getMonth() + 1
  //       //             }-${today_date.getDate()}`,
  //       //         },
  //       //       },
  //       //     },
  //       //   ],
  //       // },
  //       {
  //         model: Service,
  //         as: "service",
  //         attributes: ["service_id", "name", "user_id", "image", "rate"],
  //         include: [
  //           {
  //             model: User,
  //             as: "user",
  //             attributes: [
  //               "user_id",
  //               "full_name",
  //               "profile_image",
  //               "stripe_account_id",
  //               "stripe_customer_id",
  //             ],
  //           },
  //           {
  //             model: Category,
  //             as: "parent_category",
  //             attributes: ["category_id", "category_name"],
  //           },
  //         ],
  //       },
  //       {
  //         model: ServiceBooking,
  //         as: "booking_details",
  //         attributes: ["total_amount", "date", "start_time", "hours"],
  //       },
  //     ],
  //     order: [["createdAt", "DESC"]],
  //     offset: offset,
  //     limit: limit,
  //   });
  //   console.log('find_cart', find_cart)
  //   find_cart.rows.forEach((result) => {
  //     if (result.type === "service") {
  //       if (result.service.user.profile_image) {
  //         result.service.user.profile_image =
  //           constant.AWS_S3_URL +
  //           constant.AWS_S3_PROJECT_FOLDER +
  //           constant.AWS_S3_USER_FOLDER +
  //           result.service.user.profile_image;
  //       } else {
  //         result.service.user.profile_image = null;
  //       }

  //       if (result.service.image) {
  //         result.service.image =
  //           constant.AWS_S3_URL +
  //           constant.AWS_S3_PROJECT_FOLDER +
  //           constant.AWS_SERVICE_FOLDER +
  //           result.service.image;
  //       } else {
  //         result.service.image = null;
  //       }

  //       delete result.dataValues.event_ticket_id;
  //       delete result.dataValues.createdAt;
  //       delete result.dataValues.updatedAt;
  //       delete result.dataValues.ticket_detail;
  //     } else {
  //       if (result.ticket_detail && result.ticket_detail.event) {
  //         if (result.ticket_detail.event.user.profile_image) {
  //           result.ticket_detail.event.user.profile_image =
  //             constant.AWS_S3_URL +
  //             constant.AWS_S3_PROJECT_FOLDER +
  //             constant.AWS_S3_USER_FOLDER +
  //             result.ticket_detail.event.user.profile_image;
  //         } else {
  //           result.ticket_detail.event.user.profile_image = null;
  //         }
  //       }
        

  //       // delete result.dataValues.service_id;
  //       // delete result.dataValues.start_date;
  //       // delete result.dataValues.start_time;
  //       // delete result.dataValues.end_time;
  //       // delete result.dataValues.createdAt;
  //       // delete result.dataValues.updatedAt;
  //       // delete result.dataValues.service;
  //     }
  //   });
  //   return find_cart;
  // },

  async list(req, res) {
    let { page, type } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    let today_date = new Date();

    let where_obj = {
      user_id: req.user_id,
      type: type
    };

    if(type === "service"){
      let find_cart = await Cart.findAndCountAll({
        where: where_obj,
        include: [
          {
            model: Service,
            as: "service",
            attributes: ["service_id", "name", "user_id", "image", "rate"],
            include: [
              {
                model: User,
                as: "user",
                attributes: [
                  "user_id",
                  "full_name",
                  "profile_image",
                  "stripe_account_id",
                  "stripe_customer_id",
                ],
              },
              {
                model: Category,
                as: "parent_category",
                attributes: ["category_id", "category_name"],
              },
            ],
          },
          {
            model: ServiceBooking,
            as: "booking_details",
            attributes: ["total_amount", "date", "start_time", "hours", "stripe_customer_id"],
          },
        ],
        order: [["createdAt", "DESC"]],
        offset: offset,
        limit: limit,
      });
      console.log('find_cart', find_cart)
      find_cart.rows.forEach((result) => {
        if (result.service.user.profile_image) {
          result.service.user.profile_image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_S3_USER_FOLDER +
            result.service.user.profile_image;
        } else {
          result.service.user.profile_image = null;
        }

        if (result.service.image) {
          result.service.image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_SERVICE_FOLDER +
            result.service.image;
        } else {
          result.service.image = null;
        }

        delete result.dataValues.event_ticket_id;
        delete result.dataValues.createdAt;
        delete result.dataValues.updatedAt;
        delete result.dataValues.ticket_detail;
      });
      return find_cart;
    } else {
      let find_cart = await Cart.findAndCountAll({
        where: where_obj,
        include: [
          {
            model: EventTicket,
            as: "ticket_detail",
            required: true,
            attributes: [
              "event_ticket_id",
              "event_id",
              "type",
              "rate",
              "quantity",
            ],
            include: [
              {
                model: Event,
                as: "event",
  
                attributes: [
                  "event_id",
                  "user_id",
                  "name",
                  "address",
                  "start_date",
                  "end_date",
                  "start_time",
                  "end_time",
                ],
                include: [
                  {
                    model: EventMedia,
                    as: "media",
                    attributes: {
                      exclude: ["createdAt", "updatedAt"],
                    },
                  },
                  {
                    model: User,
                    as: "user",
                    attributes: [
                      "user_id",
                      "full_name",
                      "email",
                      "country_code",
                      "phone_number",
                      "profile_image",
                      "stripe_account_id",
                      "stripe_customer_id",
                    ],
                  },
                ],
              },
              {
                model: Event,
                as: "event",
                // attributes: ["category_id", "category_name"],
                where: {
                  start_date: {
                    [Op.gte]: `${today_date.getFullYear()}-${today_date.getMonth() + 1
                      }-${today_date.getDate()}`,
                  },
                },
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        offset: offset,
        limit: limit,
      });
      console.log('find_cart', find_cart)
      find_cart.rows.forEach((result) => {
        if (result.ticket_detail && result.ticket_detail.event) {
          if (result.ticket_detail.event.user.profile_image) {
            result.ticket_detail.event.user.profile_image =
              constant.AWS_S3_URL +
              constant.AWS_S3_PROJECT_FOLDER +
              constant.AWS_S3_USER_FOLDER +
              result.ticket_detail.event.user.profile_image;
          } else {
            result.ticket_detail.event.user.profile_image = null;
          }
        }
      });
      return find_cart;
    }
  },

  async delete(req, res) {
    let delete_cart = await Cart.destroy({
      where: {
        cart_id: req.params.id,
      },
    });
    return delete_cart;
  },
};
