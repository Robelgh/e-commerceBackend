module.exports = {
    users: {
        create: {
            firstName: {
                required: true,
                message: 'firstName cannot be empty'
            },
            lastName: {
                required: true,
                message: 'lastName cannot be empty'
            },
            email: {
                required: true,
                type: 'email',
                message: 'Invalid email'
            },
            phone: {
                required: true,
                len: 13,
                message: 'Invalid Phone'
            },
            password: {
                required: true,
                min: 6,
                message: 'Invalid Password'
            },
            address: {
                required: true,
                message: 'Invalid Address'
            }
            // profilePicture: {
            //     required: true,
            //     message: 'Invalid profilePicture'
            // },
            // gender: {
            //     required: true,
            //     message: 'Must select a gender'
            // }
        },
        update: {
            firstName: {
                required: true,
                message: 'firstName cannot be empty'
            },
            lastName: {
                required: true,
                message: 'lastName cannot be empty'
            },
            email: {
                required: true,
                type: 'email',
                message: 'Invalid email'
            },
            phone: {
                required: true,
                len: 13,
                message: 'Invalid Phone'
            },
            password: {
                required: true,
                min: 6,
                message: 'Invalid Password'
            },
            address: {
                required: true,
                message: 'Invalid Address'
            }

        },
        login: {
            email: {
                required: true,
                type: 'email',
                message: 'Invalid email'
            },
            password: {
                required: true,
                message: 'Password cannot be empty'
            }
        },
        changePassword: {
            email: {
                required: true,
                min: 6,
                message: 'Invalid old password'
            },
            // newPassword: {
            //     required: true,
            //     min: 6,
            //     message: 'minimum length of your password is 4.'
            // },
            // confirmPassword: {
            //     required: true,
            //     min: 6,
            //     message: 'minimum length of your password is 4.'
            // }
        },
        sentEmail: {
            email: {
                required: true,
                type: 'email',
                message: 'Invalid email'
            },

        }
    },
    ///////////seller///
    sellers: {
        create: {
            email: {
                required: true,
                type: 'email',
                message: 'Invalid email'
            },
            password: {
                required: true,
                min: 6,
                message: 'Invalid Password'
            }
        },
        update: {

            // email: {
            //     required: true,
            //     type: 'email',
            //     message: 'Invalid email'
            // },
            // password: {
            //     required: true,
            //     min: 6,
            //     message: 'Invalid Password'
            // },

        },
    },
    //////////////product//////////
    products: {
        create: {
            Category_id: {
                required: true,
                message: 'Category_id cannot be empty'
            },
            Name: {
                required: true,
                message: 'Name cannot be empty'
            },
            Description: {
                required: true,
                message: 'Invalid Description'
            },
            Code: {
                required: true,
                message: 'Invalid Code'
            },
            Price: {
                required: true,
                message: 'Invalid Price'
            },

        },
        ////////product photo
        productPhoto: {
            product_id: {
                required: true,
                message: 'product id cannot be empty'
            },
            product_image: {
                required: true,
                message: 'image cannot be empty'
            },

        },
        productPhotoEdit: {
            product_id: {
                required: true,
                message: 'product id cannot be empty'
            },
            product_image: {
                required: true,
                message: 'image cannot be empty'
            },

        },
        /////////end product
        update: {
            Category_id: {
                required: true,
                message: 'Category_id cannot be empty'
            },
            Name: {
                required: true,
                message: 'Name cannot be empty'
            },
            Description: {
                required: true,
                message: 'Invalid Description'
            },
            Code: {
                required: true,
                message: 'Invalid Code'
            },
            Price: {
                required: true,
                message: 'Invalid Price'
            },


        }

    },
    //////////////cart//////
    cart: {
        create: {

            product_id: {
                required: true,
                message: 'product id cannot be empty'
            },
            user_id: {
                required: true,
                message: 'Invalid user id'
            },
            quantity: {
                required: true,
                message: 'Invalid quantity'
            },
            selectedSize: {
                required: true,
                message: 'Enter Selected Size'
            },
            selectedColor: {
                required: true,
                message: 'Enter Selected Color'
            }


        },
        update: {

            product_id: {
                required: true,
                message: 'product id cannot be empty'
            },
            user_id: {
                required: true,
                message: 'Invalid user id'
            },
            quantity: {
                required: true,
                message: 'Invalid quantity'
            },
            selectedSize: {
                required: true,
                message: 'Enter Selected Size'
            },
            selectedColor: {
                required: true,
                message: 'Enter Selected Color'
            }


        }

    },
    /////////////whishing list
    wishlist: {
        create: {

            product_id: {
                required: true,
                message: 'product id cannot be empty'
            },
            user_id: {
                required: true,
                message: 'Invalid user id'
            },



        },
        update: {

            product_id: {
                required: true,
                message: 'product id cannot be empty'
            },
            user_id: {
                required: true,
                message: 'Invalid user id'
            },



        }

    },
    /////////////end product///////
    ////////catagory///
    catagory: {
        create: {

            catagory_Name: {
                required: true,
                message: 'Name cannot be empty'
            },
            // Description: {
            //     required: true,
            //     message: 'Invalid Description'
            // },


        },
        update: {

            catagory_Name: {
                required: true,
                message: 'Name cannot be empty'
            },
            // Description: {
            //     required: true,
            //     message: 'Invalid Description'
            // },


        }

    },
    /////////////end product///////
    ///////////////advertise///////
    ////////catagory///
    advertise: {
        create: {

            date: {
                required: true,
                message: 'date cannot be empty'
            },
            // Description: {
            //     required: true,
            //     message: 'Invalid Description'
            // },


        },
        update: {

            date: {
                required: true,
                message: 'Name cannot be empty'
            },
            // Description: {
            //     required: true,
            //     message: 'Invalid Description'
            // },


        }

    },
    /////////////end product///////
    ////////////////end
    ///slip start///
    slip: {
        create: {

            productName: {
                required: true,
                message: 'Name cannot be empty'
            },
            UserName: {
                required: true,
                message: 'UserName Invalid Description'
            },
            date: {
                required: true,
                message: 'date cannot be empty'
            },
            productPrice: {
                required: true,
                message: 'productPrice Invalid'
            },
            quantity: {
                required: true,
                message: 'quantity cannot be empty'
            },
            vate: {
                required: true,
                message: 'vate Invalid '
            },
            email: {
                required: true,
                message: 'email Invalid '
            },

        }


    },
    /////////////end slip///////
    /////////product specifications/////
    specifications: {
        create: {

            color: {
                required: true,
                message: 'size cannot be empty'
            },
            size: {
                required: true,
                message: 'Invalid size'
            },
        },
        update: {

            color: {
                required: true,
                message: 'size cannot be empty'
            },
            size: {
                required: true,
                message: 'Invalid size'
            },


        }

    },
    //////////end specifications////////
    /////////product specifications/////
    //////////////cart//////
    Rating: {
        create: {

            user_id: {
                required: true,
                message: 'User ID cannot be empty'
            },
            product_id: {
                required: true,
                message: 'Product ID cannot be empty'
            },
        },
        update: {

            user_id: {
                required: true,
                message: 'User ID cannot be empty'
            },
            product_id: {
                required: true,
                message: 'Product ID cannot be empty'
            },


        }

    },
    //////////end specifications////////
    /////////product specifications/////
    //////////////cart//////
    Size: {
        create: {
            product_id: {
                required: true,
                message: 'Product ID cannot be empty'
            },
        },
        update: {
            product_id: {
                required: true,
                message: 'Product ID cannot be empty'
            },


        }

    },
    //////////end specifications////////
    /////////product color/////
    Color: {
        create: {
            product_id: {
                required: true,
                message: 'Product ID cannot be empty'
            },
        },
        update: {
            product_id: {
                required: true,
                message: 'Product ID cannot be empty'
            },


        }

    },
    //////////end color////////
    //////////////cart//////
    Preview: {
        create: {

            user_id: {
                required: true,
                message: 'User ID cannot be empty'
            },
            product_id: {
                required: true,
                message: 'Product ID cannot be empty'
            },
        },
        update: {

            text: {
                required: true,
                message: 'Text cannot be empty'
            },
        }

    },
    //////////end preview////////
    /////////coupon/////
    Coupon: {
        create: {
            code: {
                required: true,
                message: 'Code cannot be empty'
            },
            firstDate: {
                required: true,
                message: 'First Date cannot be empty'
            },
        },
        update: {
            code: {
                required: true,
                message: 'Code cannot be empty'
            },
            firstDate: {
                required: true,
                message: 'End Date cannot be empty'
            },


        }

    },
    //////////end coupon////////
    /////////coupon/////
    testimonial: {
        create: {
            name: {
                required: true,
                message: 'Name cannot be empty'
            },
            message: {
                required: true,
                message: 'message cannot be empty'
            },
        },
        update: {
            name: {
                required: true,
                message: 'Name cannot be empty'
            },
            message: {
                required: true,
                message: 'message cannot be empty'
            },


        }

    },
    //////////end coupon////////
    purchase: {
        create: {
            userID: {
                required: true,
                message: 'User ID cannot be empty'
            },
            companyName: {
                required: true,
                message: 'company Name cannot be empty'
            },
            tinNumber: {
                required: true,
                // type: 'email',
                message: 'Invalid tinNumber'
            },
            companyAddress: {
                required: true,
                message: 'Invalid companyAddress'
            }

        },
        update: {
            userID: {
                required: true,
                message: 'User ID cannot be empty'
            },
            companyName: {
                required: true,
                message: 'company Name cannot be empty'
            },
            tinNumber: {
                required: true,
                // type: 'email',
                message: 'Invalid tinNumber'
            },
            companyAddress: {
                required: true,
                message: 'Invalid companyAddress'
            }

        }
    },
    documents: {
        create: {
            fileName: {
                required: true,
                message: 'fileName cannot be empty'
            },
            date: {
                required: true,
                message: 'date cannot be empty'
            },
        },
        update: {
            fileName: {
                required: true,
                message: 'fileName cannot be empty'
            },
            date: {
                required: true,
                message: 'date cannot be empty'
            },
        }
    }
};
