import 'package:flutter/material.dart';
import 'package:covid_safe_building/Screens/Welcome/components/body/body_desktop.dart';
import 'package:covid_safe_building/Screens/Welcome/components/body/body_mobile.dart';
import 'package:covid_safe_building/responsive/responsive.dart';

class Body extends StatelessWidget {
  const Body({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Responsive(
      mobile: BodyMobile(),
      tablet: BodyDesktop(),
      desktop: BodyDesktop(),
    );
  }
}
