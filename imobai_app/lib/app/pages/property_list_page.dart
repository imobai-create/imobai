import 'package:flutter/material.dart';
import '../services/property_api.dart';

class PropertyListPage extends StatefulWidget {
  const PropertyListPage({super.key});

  @override
  State<PropertyListPage> createState() => _PropertyListPageState();
}

class _PropertyListPageState extends State<PropertyListPage> {

  late Future<List<dynamic>> _futureProperties;

  @override
  void initState() {
    super.initState();
    _futureProperties = PropertyApi.getProperties();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Meus imóveis')),
      body: FutureBuilder<List<dynamic>>(
        future: _futureProperties,
        builder: (context, snapshot) {

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Erro: ${snapshot.error}'));
          }

          final properties = snapshot.data ?? [];

          if (properties.isEmpty) {
            return const Center(child: Text('Nenhum imóvel cadastrado.'));
          }

          return ListView.builder(
            itemCount: properties.length,
            itemBuilder: (context, index) {
              final item = properties[index];

              return ListTile(
                title: Text(item['title']),
                subtitle: Text('${item['city']} - R\$ ${item['price']}'),
              );
            },
          );
        },
      ),
    );
  }
}
