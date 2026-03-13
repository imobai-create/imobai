import 'package:flutter/material.dart';

class AppTheme {

  static const primary = Color(0xFF5B61F6);

  static ThemeData theme = ThemeData(

    useMaterial3: true,

    scaffoldBackgroundColor: const Color(0xFFF4F6FA),

    colorScheme: ColorScheme.fromSeed(
      seedColor: primary,
    ),

    cardTheme: const CardThemeData(

      elevation: 6,

      shape: RoundedRectangleBorder(

        borderRadius: BorderRadius.all(
          Radius.circular(20),
        ),

      ),

    ),

    elevatedButtonTheme: ElevatedButtonThemeData(

      style: ElevatedButton.styleFrom(

        backgroundColor: primary,

        foregroundColor: Colors.white,

      ),

    ),

  );

}