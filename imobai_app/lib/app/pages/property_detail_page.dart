import 'package:flutter/material.dart';

class PropertyDetailPage extends StatelessWidget {

  final Map property;

  const PropertyDetailPage({
    super.key,
    required this.property,
  });

  @override
  Widget build(BuildContext context) {

    String title = property['title'].toString();
    String city = property['city'].toString();
    String price = property['price'].toString();

    return Scaffold(

      appBar: AppBar(
        title: const Text('Detalhes do imóvel'),
      ),

      body: Padding(

        padding: const EdgeInsets.all(20),

        child: Column(

          crossAxisAlignment: CrossAxisAlignment.start,

          children: [

            Text(
              title,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 20),

            Text(
              'Cidade: $city',
              style: const TextStyle(fontSize: 18),
            ),

            const SizedBox(height: 10),

            Text(
              'Preço: R\$ $price',
              style: const TextStyle(
                fontSize: 20,
                color: Colors.green,
                fontWeight: FontWeight.bold,
              ),
            ),

          ],

        ),

      ),

    );

  }

}

