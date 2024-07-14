# food-delivery-app

## Description

This is the food delivery app. It contains three microservices user-service, restaurant-service and delivery-agent-service.

user-service -> handle user related operations like: get online restaurant, place order from restaurant, and gives rating to order and delivery agent.

restaurant-service -> handle restaurant related operations like: Update the menu, pricing, and availability status (online/offline) of the restaurant, accept/reject the order, and process it if they accept the order, and Auto-assign a delivery agent to an order based on availability.

delivery-agent-service -> handle delivery-agent related operations like: Update the delivery status of orders.

## Note:
we use rabbitMQ as a message broker for inter communication between services.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/)
- [NPM](https://www.npmjs.com/get-npm) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/download/)
- [RabbitMQ](https://www.rabbitmq.com/download.html)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Deepak675-max/food-delivery-app.git
   cd *[service name]*
