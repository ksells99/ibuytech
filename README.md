# iBuyTech

iBuyTech is a fully-functional ecommerce store built using the MERN stack, with Redux for state management. It is hosted on Heroku and can be accessed here **ksells-ibuytech.herokuapp.com**

Users can browse products, add them to a basket (stored in local storage), and then place an order and pay via the PayPal API.

The application also features an admin section, where site administrators can view all users, create/edit the product inventory, and mark any orders as having been delivered to the customer.

The core application was created using Brad Traversy's 'MERN eCommerce from Scratch' course on Udemy, however I have overhauled the design, added new features and squashed a number of bugs.

New features I added:

- **User's shipping address is now saved in the database** (previously it was saved in local storage), and fetched when a user places an order. If they wish to update the address when placing the order, it will perform a PUT request on the database and update their saved address.

- **Active/inactive flag for products**. In the core project, if a user wanted to remove a product from the store, it had to be deleted - this had the negative effect of also deleting any orders containing this product! To resolve this, I added an active/inactive flag for products - the admin users can control this to toggle whether a product is visible in the storefront or not.

## Showcase images

### Shopping

_Homepage_
![Showcase1](/showcase-images/showcase-home.png?raw=true "Showcase1")

_Product page_
![Showcase2](/showcase-images/showcase-product.png?raw=true "Showcase2")

_Basket_
![Showcase3](/showcase-images/showcase-basket.png?raw=true "Showcase3")

_Order page_
![Showcase4](/showcase-images/showcase-order.png?raw=true "Showcase4")

_User profile/orders_
![Showcase5](/showcase-images/showcase-orders.png?raw=true "Showcase5")

### Admin

_User list_
![Showcase6](/showcase-images/showcase-admin-users.png?raw=true "Showcase6")

_Product list_
![Showcase7](/showcase-images/showcase-admin-products.png?raw=true "Showcase7")

_Order list_
![Showcase8](/showcase-images/showcase-admin-orders.png?raw=true "Showcase8")
