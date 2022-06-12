import 'dart:async';

import 'package:covid_safe_building/NavBar.dart';
import 'package:covid_safe_building/Screens/Welcome/welcome_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:webview_flutter/webview_flutter.dart';

const API_URL = 'http://127.0.0.1:5000';
final storage = FlutterSecureStorage();

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Covid Safe Building',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const WelcomeScreen());
  }
}
