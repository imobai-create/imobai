export class CreatePropertyDto {
  static Future<List<dynamic>> getProperties() async {
  final response = await http.get(
    Uri.parse('$baseUrl/properties'),
  );

  if (response.statusCode != 200) {
    throw Exception('Erro ao buscar imóveis');
  }

  return jsonDecode(response.body);
}

  title: string;
  city: string;
  price: number;
}
