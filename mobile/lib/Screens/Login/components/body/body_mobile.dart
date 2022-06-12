import 'dart:convert';

import 'package:covid_safe_building/Screens/Dashboard/dashboard.dart';
import 'package:covid_safe_building/Screens/Login/components/background.dart';
import 'package:covid_safe_building/Screens/Signup/signup_screen.dart';
import 'package:covid_safe_building/components/already_have_an_account_acheck.dart';
import 'package:covid_safe_building/components/rounded_button.dart';
import 'package:covid_safe_building/components/rounded_input_field.dart';
import 'package:covid_safe_building/components/rounded_password_field.dart';
import 'package:covid_safe_building/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:http/http.dart' as http;

class BodyMobile extends StatelessWidget {
  BodyMobile({
    Key? key,
  }) : super(key: key);

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Background(
      child: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              "LOGIN",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: size.height * 0.03),
            SvgPicture.asset(
              "assets/icons/login.svg",
              height: size.height * 0.35,
            ),
            SizedBox(height: size.height * 0.03),
            RoundedInputField(
              hintText: "Your Email",
              onChanged: (value) {
                _usernameController.text = value;
              },
              controller: _usernameController,
            ),
            RoundedPasswordField(
                onChanged: (value) {
                  _passwordController.text = value;
                },
                controller: _passwordController),
            RoundedButton(
              text: "LOGIN",
              press: () async {
                var username = _usernameController.text;
                var password = _passwordController.text;

                var jwt = await attemptLogIn(username, password);
                if (jwt != null) {
                  storage.write(key: "jwt", value: jwt);
                  // ignore: use_build_context_synchronously
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ViewApp.fromBase64(jwt)));
                } else {
                  // ignore: use_build_context_synchronously
                  displayDialog(context, "An Error Occurred",
                      "No account was found matching that username and password");
                }
              },
            ),
            SizedBox(height: size.height * 0.03),
            AlreadyHaveAnAccountCheck(
              press: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return const SignUpScreen();
                    },
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

void displayDialog(BuildContext context, String title, String text) =>
    showDialog(
      context: context,
      builder: (context) =>
          AlertDialog(title: Text(title), content: Text(text)),
    );

Future<String?> attemptLogIn(String username, String password) async {
  var res = await http.post(
    Uri.parse("$API_URL/login"),
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonEncode({"email": username, "password": password}),
  );
  if (res.statusCode == 200) return res.body;
  return null;
}

Future<int> attemptSignUp(String username, String password) async {
  var res = await http.post(Uri.parse('$API_URL/signup'),
      body: {"username": username, "password": password});
  return res.statusCode;
}
