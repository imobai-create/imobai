import 'package:flutter/material.dart';
import 'property_detail_page.dart';
import '../widgets/main_drawer.dart';

class MarketplacePage extends StatelessWidget {
  const MarketplacePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const MainDrawer(),

      appBar: AppBar(
        title: const Text(
          'ImobAI',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 22,
          ),
        ),
        centerTitle: true,
      ),

      body: ListView(
        children: [

          // HERO IMAGE

          GestureDetector(
            onTap: () {

              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => PropertyDetailPage(
                    property: {
                      "title": "Casa Costa Laguna",
                      "city": "Nova Lima",
                      "price": "R\$ 8.500.000",
                      "image":
                          "http://127.0.0.1:3000/uploads/lustre.jpg",
                      "description":
                          "482m² • 4 suítes • piscina aquecida • sauna • 4 vagas",
                    },
                  ),
                ),
              );
            },
            child: Stack(
              children: [

                Container(
                  height: 320,
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(
                          "http://127.0.0.1:3000/uploads/lustre.jpg"),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),

                Container(
                  height: 320,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.8),
                      ],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                ),

                Positioned(
                  bottom: 20,
                  left: 20,
                  right: 20,
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,
                    children: [

                      const Text(
                        "CASA COSTA LAGUNA",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 6),

                      const Text(
                        "Nova Lima • MG",
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 16,
                        ),
                      ),

                      const SizedBox(height: 10),

                      const Text(
                        "R\$ 8.500.000",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                    ],
                  ),
                )
              ],
            ),
          },

          const SizedBox(height: 20),

          // SECTION TITLE

          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              "Imóveis em destaque",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          // PROPERTY CARD

          propertyCard(
            context,
            "Casa Costa Laguna",
            "Nova Lima",
            "R\$ 8.500.000",
            "http://127.0.0.1:3000/uploads/lustre.jpg",
          ),

        ],
      ),
    );
  }

  Widget propertyCard(
      context,
      title,
      city,
      price,
      image,
      ) {
    return GestureDetector(
      onTap: () {

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PropertyDetailPage(
              property: {
                "title": title,
                "city": city,
                "price": price,
                "image": image,
                "description":
                    "482m² • 4 suítes • piscina aquecida • sauna",
              },
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(
            horizontal: 16, vertical: 8),
        child: Card(
          elevation: 6,
          shape: RoundedRectangleBorder(
            borderRadius:
                BorderRadius.circular(16),
          ),
          child: Column(
            children: [

              ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(
                        top: Radius.circular(16)),
                child: Image.network(
                  image,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),

              ListTile(
                title: Text(title),
                subtitle: Text(city),
                trailing: Text(
                  price,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

            ],
          ),
        ),
      ),
    );
  }
}