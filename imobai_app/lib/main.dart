import 'package:flutter/material.dart';

import 'app/pages/login_page.dart';
import 'app/pages/marketplace_page.dart';

import 'app/services/auth_service.dart';


void main() {

  runApp(const MyApp());

}


class MyApp extends StatefulWidget {

  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();

}


class _MyAppState extends State<MyApp> {

  bool logged = false;

  bool loaded = false;


  @override
  void initState() {

    super.initState();

    checkLogin();

  }


  checkLogin() async {

    logged = await AuthService.isLogged();

    setState(() {

      loaded = true;

    });

  }


  @override
  Widget build(BuildContext context) {

    if (!loaded) {

      return const MaterialApp(

        home: Scaffold(

          body: Center(

            child: CircularProgressIndicator(),

          ),

        ),

      );

    }


    return MaterialApp(

      debugShowCheckedModeBanner: false,

      home: logged

          ? const MarketplacePage()

          : const LoginPage(),

    );

  }

}