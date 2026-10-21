import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const raiz=fileURLToPath(new URL('../dist/',import.meta.url));
const puerto=Number(process.env.MAZO_PUERTO||8080);
const tipos={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/mazo/__servidor_local__'){
   res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
   res.end(JSON.stringify({proyecto:'white-death-deck-manager',raiz:path.resolve(raiz,'..'),pid:process.pid}));return;
  }
  if(!url.pathname.startsWith('/mazo/')){res.writeHead(302,{Location:'/mazo/'});res.end();return;}
  const relativa=decodeURIComponent(url.pathname.slice('/mazo/'.length))||'index.html';
  const archivo=path.resolve(raiz,relativa);
  if(!archivo.startsWith(raiz)){res.writeHead(403);res.end();return;}
  const contenido=await readFile(archivo);
  res.writeHead(200,{'Content-Type':tipos[path.extname(archivo)]||'application/octet-stream','Cache-Control':'no-store'});res.end(contenido);
 }catch{res.writeHead(404);res.end('No encontrado');}
}).listen(puerto,'127.0.0.1',()=>console.log(`Gestor: http://127.0.0.1:${puerto}/mazo/`));
