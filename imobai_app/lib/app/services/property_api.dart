import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class PropertyApi {

  static const String baseUrl = 'http://127.0.0.1:3000';

  // LISTAR

  static Future<List<dynamic>> getProperties() async {

    final response =
        await http.get(Uri.parse('$baseUrl/properties'));

    if (response.statusCode == 200) {

      return jsonDecode(response.body);

    } else {

      throw Exception('Erro ao carregar imóveis');

    }

  }


  // CRIAR IMOVEL

  static Future<void> createProperty(Map data) async {

    final response =
        await http.post(
          Uri.parse('$baseUrl/properties'),
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode(data),
        );

    if (response.statusCode != 201) {

      throw Exception('Erro ao criar imóvel');

    }

  }


  // UPLOAD IMAGEM

  static Future<String> uploadImage(File image) async {

    var request =
        http.MultipartRequest(
          'POST',
          Uri.parse('$baseUrl/properties/upload'),
        );

    request.files.add(
      await http.MultipartFile.fromPath(
        'file',
        image.path,
      ),
    );

    var response =
        await request.send();

    if (response.statusCode == 201) {

      var responseData =
          await response.stream.bytesToString();

      var json =
          jsonDecode(responseData);

      return json['url'];

    } else {

      throw Exception('Erro upload imagem');

    }

  }

}
