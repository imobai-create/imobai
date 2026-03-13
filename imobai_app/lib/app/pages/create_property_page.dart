import 'dart:io';

import 'package:flutter/material.dart';

import 'package:image_picker/image_picker.dart';

import '../services/property_api.dart';



class CreatePropertyPage extends StatefulWidget {

const CreatePropertyPage({super.key});



@override
State<CreatePropertyPage> createState() =>
_CreatePropertyPageState();

}



class _CreatePropertyPageState
extends State<CreatePropertyPage> {



List<File> images = [];

bool loading = false;

double progress = 0;



final picker = ImagePicker();



pickImages() async {

final result =
await picker.pickMultiImage();



if (result.isNotEmpty) {

setState(() {

images =
result.map((e) =>
File(e.path)).toList();

});

}

}



upload() async {



setState(() {

loading = true;

progress = 0;

});



List<String> urls = [];



for (int i = 0;
i < images.length;
i++) {



final url =
await PropertyApi.uploadImage(
images[i]);



urls.add(url);



setState(() {

progress =
(i + 1) / images.length;

});

}



await PropertyApi.createProperty({

"title": "Imóvel teste",

"city": "Uberlândia",

"price": 500000,

"images": urls

});



setState(() {

loading = false;

});



}



@override
Widget build(BuildContext context) {

return Scaffold(

appBar: AppBar(

title: const Text(
"Cadastrar imóvel"),

),



body: Column(

children: [



ElevatedButton(

onPressed: pickImages,

child:
const Text("Selecionar imagens"),

),



SizedBox(

height: 120,

child:
ListView.builder(

scrollDirection:
Axis.horizontal,

itemCount:
images.length,

itemBuilder:
(_, i) =>

Padding(

padding:
const EdgeInsets.all(8),

child:
Image.file(
images[i]),

),

),

),



if (loading)

Column(

children: [

CircularProgressIndicator(),

Text(

"${(progress * 100).toInt()}%"),

],

),



ElevatedButton(

onPressed: upload,

child: const Text("Salvar"),

),

],

),

);

}

}
