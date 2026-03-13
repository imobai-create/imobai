import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {

  static const String baseUrl = 'http://127.0.0.1:3000';
  static const String tokenKey = 'token';

  // LOGIN

  static Future<bool> login(String email, String password) async {

    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {

      final data = jsonDecode(response.body);

      final prefs = await SharedPreferences.getInstance();

      await prefs.setString(tokenKey, data['access_token']);

      return true;

    }

    return false;

  }

  // VERIFICAR LOGIN

  static Future<bool> isLogged() async {

    final prefs = await SharedPreferences.getInstance();

    final token = prefs.getString(tokenKey);

    return token != null;

  }

  // LOGOUT

  static Future<void> logout() async {

    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(tokenKey);

  }

}
