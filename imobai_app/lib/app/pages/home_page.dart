import 'package:flutter/material.dart';
import '../services/property_api.dart';
import 'property_detail_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {

  late Future<List<dynamic>> futureProperties;

  String filtro = "";

  @override
  void initState() {
    super.initState();
    carregar();
  }

  carregar() {

    futureProperties = PropertyApi.getProperties();

  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: const Color(0xfff8fafc),

      appBar: AppBar(

        backgroundColor: Colors.white,

        elevation: 1,

        iconTheme: const IconThemeData(color: Colors.black),

        title: const Text(
          "ImobAI",
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),

      ),

      drawer: drawer(),

      body: FutureBuilder(

        future: futureProperties,

        builder: (context, snapshot) {

          if (!snapshot.hasData) {

            return const Center(
                child: CircularProgressIndicator());

          }

          List list = snapshot.data!;

          if (filtro.isNotEmpty) {

            list = list.where((p) =>
            (p["type"] ?? "")
                .toString()
                .toLowerCase()
                .contains(filtro.toLowerCase()))
                .toList();

          }

          return ListView(

            children: [

              banner(),

              categorias(),

              if(list.isEmpty)

                const Padding(
                  padding: EdgeInsets.all(20),
                  child: Text("Nenhum imóvel encontrado"),
                ),

              ...list.map((property) =>
                  card(property))

            ],

          );

        },

      ),

    );

  }

  Widget banner() {

    return Container(

      margin: const EdgeInsets.all(20),

      padding: const EdgeInsets.all(30),

      decoration: BoxDecoration(

        color: Colors.white,

        borderRadius: BorderRadius.circular(20),

      ),

      child: const Text(

        "Marketplace imobiliário\nseguro com blockchain",

        style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold),

      ),

    );

  }

  Widget categorias() {

    return SizedBox(

      height: 70,

      child: ListView(

        scrollDirection: Axis.horizontal,

        children: [

          cat(""),
          cat("Casa"),
          cat("Apartamento"),
          cat("Fazenda"),

        ],

      ),

    );

  }

  Widget cat(String nome) {

    return GestureDetector(

      onTap: () {

        setState(() {

          filtro = nome;

        });

      },

      child: Container(

        margin: const EdgeInsets.only(left: 20),

        padding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 15),

        decoration: BoxDecoration(

          color: Colors.white,

          borderRadius: BorderRadius.circular(20),

        ),

        child: Text(

          nome.isEmpty ? "Todos" : nome,

          style: const TextStyle(
              fontWeight: FontWeight.bold),

        ),

      ),

    );

  }

  Widget card(property) {

    return GestureDetector(

      onTap: () {

        Navigator.push(

            context,

            MaterialPageRoute(

                builder: (_) =>
                    PropertyDetailPage(
                        property: property)));

      },

      child: Container(

        margin: const EdgeInsets.all(20),

        decoration: BoxDecoration(

          color: Colors.white,

          borderRadius: BorderRadius.circular(20),

        ),

        child: ListTile(

          title: Text(property["title"] ?? ""),

          subtitle: Text("R\$ ${property["price"]}"),

        ),

      ),

    );

  }

  Widget drawer() {

    return Drawer(

      child: ListView(

        children: [

          const DrawerHeader(

            child: Text(
              "Menu",
              style: TextStyle(fontSize: 22),
            ),

          ),

          item("Login"),
          item("Meus imóveis"),
          item("Cadastrar"),

          item("Contato"),
          item("Instagram"),

        ],

      ),

    );

  }

  Widget item(String text) {

    return ListTile(

      title: Text(text),

    );

  }

}




