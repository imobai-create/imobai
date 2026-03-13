import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../pages/marketplace_page.dart';
import '../pages/create_property_page.dart';
import '../pages/property_list_page.dart';
import '../pages/login_page.dart';

class MainDrawer extends StatelessWidget {
  const MainDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [

          Container(
            width: double.infinity,
            padding: const EdgeInsets.only(top: 60, bottom: 20),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFF6A11CB),
                  Color(0xFF2575FC),
                ],
              ),
            ),
            child: const Center(
              child: Text(
                "ImobAI",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),

          ListTile(
            leading: const Icon(Icons.home),
            title: const Text("Marketplace"),
            onTap: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => const MarketplacePage(),
                ),
              );
            },
          ),

          ListTile(
            leading: const Icon(Icons.list),
            title: const Text("Meus imóveis"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const PropertyListPage(),
                ),
              );
            },
          ),

          ListTile(
            leading: const Icon(Icons.add),
            title: const Text("Cadastrar imóvel"),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const CreatePropertyPage(),
                ),
              );
            },
          ),

          ListTile(
            leading: const Icon(Icons.favorite),
            title: const Text("Favoritos"),
            onTap: () {},
          ),

          ListTile(
            leading: const Icon(Icons.chat),
            title: const Text("Contato"),
            onTap: () {},
          ),

          ListTile(
            leading: const Icon(Icons.camera_alt),
            title: const Text("Instagram"),
            onTap: () {},
          ),

          const Spacer(),

          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text("Logout"),
            onTap: () async {

              AuthService.logout();

              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (_) => const LoginPage(),
                ),
                (route) => false,
              );
            },
          ),
        ],
      ),
    );
  }
}