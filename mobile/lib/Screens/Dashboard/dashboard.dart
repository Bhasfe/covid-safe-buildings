import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  // runApp(const MaterialApp(
  //   home: ViewApp(),
  // ));
}

class ViewApp extends StatefulWidget {
  ViewApp(this.jwt, this.payload, {Key? key}) : super(key: key);

  factory ViewApp.fromBase64(String jwt) => ViewApp(
      jwt,
      json.decode(
          ascii.decode(base64.decode(base64.normalize(jwt.split(".")[1])))));

  String jwt;
  final Map<String, dynamic> payload;

  @override
  State<ViewApp> createState() => _ViewAppState();
}

class _ViewAppState extends State<ViewApp> {
  WebViewController? _webViewController;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Padding(
            padding: EdgeInsets.only(top: 0),
            child: WebView(
              initialUrl: 'http://localhost:3000',
              javascriptMode: JavascriptMode.unrestricted,
              javascriptChannels: <JavascriptChannel>{
                JavascriptChannel(
                    name: 'BRT',
                    onMessageReceived: (s) {
                      // TODO: WebView tarafından çıkış yapıldı,
                      // token güncellendi gibi durumlar işlenecek.
                      log("WebView'den mesaj var: ${s.message}");
                    }),
              },
              onWebViewCreated: (WebViewController webViewController) {
                _webViewController = webViewController;
              },
              debuggingEnabled: true,
              onPageFinished: (String url) async {
                String jwt = widget.jwt;

                await _webViewController?.runJavascript(
                    "localStorage.setItem('token', JSON.stringify($jwt))");

                await _webViewController?.runJavascript(
                    "document.body.classList.add('flutter-webcontent')");
              },
              userAgent: 'mobile',
              zoomEnabled: false,
            )));
  }
}
