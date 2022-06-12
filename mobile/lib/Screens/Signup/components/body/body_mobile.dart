import 'dart:convert';
import 'dart:developer';

import 'package:covid_safe_building/Screens/Dashboard/dashboard.dart';
import 'package:covid_safe_building/main.dart';
import 'package:flutter/material.dart';
import 'package:covid_safe_building/Screens/Login/login_screen.dart';
import 'package:covid_safe_building/Screens/Signup/components/background.dart';
import 'package:covid_safe_building/Screens/Signup/components/or_divider.dart';
import 'package:covid_safe_building/Screens/Signup/components/social_icon.dart';
import 'package:covid_safe_building/components/already_have_an_account_acheck.dart';
import 'package:covid_safe_building/components/rounded_button.dart';
import 'package:covid_safe_building/components/rounded_input_field.dart';
import 'package:covid_safe_building/components/rounded_password_field.dart';
import 'package:flutter_svg/svg.dart';

import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class BodyMobile extends StatelessWidget {
  BodyMobile({Key? key}) : super(key: key);

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
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
              "SIGNUP",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: size.height * 0.02),
            SvgPicture.asset(
              "assets/icons/signup.svg",
              height: size.height * 0.2,
            ),
            RoundedInputField(
              hintText: "Your Email",
              onChanged: (value) {
                _emailController.text = value;
              },
              controller: _emailController,
            ),
            RoundedInputField(
                hintText: "Name",
                onChanged: (value) {
                  _nameController.text = value;
                },
                controller: _nameController),
            RoundedInputField(
                hintText: "Last name",
                onChanged: (value) {
                  _lastNameController.text = value;
                },
                controller: _lastNameController),
            RoundedInputField(
                hintText: "Phone",
                onChanged: (value) {
                  _phoneController.text = value;
                },
                controller: _phoneController),
            RoundedPasswordField(
              onChanged: (value) {
                _passwordController.text = value;
              },
              controller: _passwordController,
            ),
            RoundedButton(
              text: "SIGNUP",
              press: () async {
                var email = _emailController.text;
                var password = _passwordController.text;
                var name = _nameController.text;
                var lastname = _lastNameController.text;
                var phone = _phoneController.text;

                var jwt =
                    await attemptSignUp(email, password, name, lastname, phone);

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
                      "No account was found matching that email and password");
                }
              },
            ),
            SizedBox(height: size.height * 0.03),
            AlreadyHaveAnAccountCheck(
              login: false,
              press: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return const LoginScreen();
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

Future<String?> attemptLogIn(String email, String password) async {
  var res = await http.post(
    Uri.parse("$API_URL/login"),
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonEncode({"email": email, "password": password}),
  );
  if (res.statusCode == 200) return res.body;
  return null;
}

Future<String?> attemptSignUp(String email, String password, String name,
    String lastname, String phone) async {
  var res = await http.post(Uri.parse('$API_URL/register'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "email": email,
        "password": password,
        "first_name": name,
        "last_name": lastname,
        "phone": phone
      }));

  if (res.statusCode == 201) {
    return attemptLogIn(email, password);
  }
  return null;
}
