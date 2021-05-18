# Deco Three


## IFC importation

L'importation des fichiers IFC est basée au niveau du modèle Site.

Dans le contrôleur `Site`, le fichier est téléchargé est transformé pour l'importation dans la base de données Mongo :

* Source : [/src/controllers/three.site.controller.ts](https://docs.bimaps.io/api/deco-three/modules.html#threesitecontroller)
* Endpoint: `POST /three/site/:siteId/import/ifc`
* Content-Type: `multipart/form-data`
* Body: `ifc` contenant le fichier IFC à envoyer


Remarque importante: cette requête n'attend pas la fin de l'importation du fichier pour renvoyer une réponse. Au contraire, si l'API reçoit un fichier correct elle renvoie immédiatement pour avertir le client que le fichier est bien reçu et qu'il est en traitement.

Le fichier doit être envoyé en mode `multipart` et attaché à la requête sous le nom de `ifc`. 

La fonction `importIfc` est appelée pour lancer le processus : 
 [/src/controllers/three.core.controller.ts](https://docs.bimaps.io/api/deco-three/classes/threecorecontrollermiddleware.html#importifc)


### Exemple d'un envoi de fichier IFC

**Envoi du fichier**

```java
HttpResponse<String> response = Unirest.post("http://localhost:3001/three/site/5dea56767e6ac104dac9fde0/import/ifc?apiKey=e4be3bd3fb61")
  .header("content-type", "multipart/form-data; boundary=---011000010111000001101001")
  .header("authorization", "Bearer 0761528b2a3c1d969d85767c686dafb2")
  .body("-----011000010111000001101001\r\nContent-Disposition: form-data; name=\"ifc\"\r\n\r\n\r\n-----011000010111000001101001--\r\n")
  .asString();
```

**Réponse**

```json
{
    "id":"60991bd286960500085cfec8",
    "_createdAt":"2021-05-07T10:41:06.209Z",
    "_updatedAt":"2021-05-07T11:41:06.209Z",
    "status":"in-progress",
    "startedAt":"07-05-2021"
}
```


### Interrogation de l'état de la transformation

* Source: `/src/controllers/three.site.controller.ts`
* Endpoint: `GET /three/site/:siteId/import/ifc/:operationId`
* Content-Type: `application/json`


**Réponse**

```json
{
    "id":"60991bd286960500085cfec8",
    "_createdAt":"2021-05-07T11:41:06.209Z",
    "_updatedAt":"2021-05-07T11:41:06.209Z",
    "status":"in-progress",
    "startedAt":"07-05-2021"}
```

**Status**

* in-progress : En cours de traitement
* completed : Fin du traitement


**Workflow**
1. IfcConvert
2. Importation des OBJ dans Three
3. Importation dans MongoDB
4. Ifc2Json
5. Fusion des métadonnées dans la base de données



## Flux & Rapport (calculator)

- API REST for check : [API Checker](https://docs.bimaps.io/api/restapi#vue-d'ensemble-des-checkers)
