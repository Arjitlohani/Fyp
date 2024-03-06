import 'package:flutter/material.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  _CartScreenState createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  List<CartItem> _cartItems = []; // List to store cart items

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cart'),
      ),
      body: _cartItems.isEmpty
          ? Center(
              child: const Text('Your cart is empty'),
            )
          : ListView.builder(
              itemCount: _cartItems.length,
              itemBuilder: (context, index) {
                return _buildCartItem(_cartItems[index]);
              },
            ),
    );
  }

  Widget _buildCartItem(CartItem item) {
    return ListTile(
      title: Text(item.name),
      subtitle: Text('Price: ${item.price} | Quantity: ${item.quantity}'),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            onPressed: () {
              setState(() {
                item.quantity++; // Increase quantity
              });
            },
            icon: const Icon(Icons.add),
          ),
          Text('${item.quantity}'),
          IconButton(
            onPressed: () {
              if (item.quantity > 1) {
                setState(() {
                  item.quantity--; // Decrease quantity
                });
              }
            },
            icon: const Icon(Icons.remove),
          ),
        ],
      ),
    );
  }
}

class CartItem {
  final String name;
  final double price;
  int quantity;

  CartItem({
    required this.name,
    required this.price,
    this.quantity = 1,
  });
}
