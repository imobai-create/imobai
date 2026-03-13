import 'package:flutter/material.dart';

import '../services/auth_service.dart';

import 'marketplace_page.dart';

class LoginPage extends StatefulWidget {

const LoginPage({super.key});

@override
State<LoginPage> createState() => _LoginPageState();

}

class _LoginPageState extends State<LoginPage> {

final emailController = TextEditingController();

final passwordController = TextEditingController();

bool loading = false;

login() async {

setState(() {
loading = true;
});

bool ok = await AuthService.login(
emailController.text,
passwordController.text,
);

setState(() {
loading = false;
});

if (ok) {

Navigator.pushReplacement(
context,
MaterialPageRoute(
builder: (_) => const MarketplacePage(),
),
);

} else {

ScaffoldMessenger.of(context).showSnackBar(
const SnackBar(
content: Text('Login inválido'),
),
);

}

}

@override
Widget build(BuildContext context) {

return Scaffold(

body: Center(

child: Container(

width: 350,

padding: const EdgeInsets.all(30),

decoration: BoxDecoration(
color: Colors.white,
borderRadius: BorderRadius.circular(20),
boxShadow: [
BoxShadow(
color: Colors.black.withOpacity(0.05),
blurRadius: 20,
),
],
),

child: Column(

mainAxisSize: MainAxisSize.min,

children: [

const Text(
'ImobAI',
style: TextStyle(
fontSize: 32,
fontWeight: FontWeight.bold,
),
),

const SizedBox(height: 30),

TextField(
controller: emailController,
decoration: const InputDecoration(
labelText: 'Email',
),
),

const SizedBox(height: 15),

TextField(
controller: passwordController,
obscureText: true,
decoration: const InputDecoration(
labelText: 'Senha',
),
),

const SizedBox(height: 25),

loading
? const CircularProgressIndicator()
: ElevatedButton(
onPressed: login,
child: const Text('Entrar'),
),

],
),
),
),
);

}

}






