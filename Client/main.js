
import {PlivackiKlub} from "./klub.js";
import {Disciplina} from "./disciplina.js";
import {Plivac} from "./plivac.js";
import { Rezultat } from "./rezultat.js";
import {Rez} from "./rez.js";



var listaDisciplina=[];

fetch("https://localhost:5001/Disciplina/PreuzmiDiscipline")
.then(x=>
    {
        x.json().then(discipline=>
            {
                discipline.forEach(disc => 
                {   
                    var d=new Disciplina(disc.id,disc.stil,disc.distanca); 
                    listaDisciplina.push(d);
                   
                });
                //dalje
var listaKlubova=[];
fetch("https://localhost:5001/Klub/PreuzmiSveKlubove")
.then(x=>
    {
        x.json().then(klubovi=>
            {
                var poz=document.createElement("div");
                poz.className="pozadina";
                document.body.appendChild(poz);

                klubovi.forEach(klub => 
                {   
                    fetch("https://localhost:5001/Klub/PreuzmiSvePlivace/"+klub.id)
                    .then(p=>
                        {
                            if(p.ok)
                            {
                                p.json().then(data=>
                                {
                                    let listaPlivaca=[];
                                    data.forEach(el=>
                                        {
                                            let list=[];
                                            el.plivacNaTakmicenjima.forEach(x=>
                                                {
                                                    let rez=new Rez(x.plasman,x.godina);
                                                    list.push(rez);
                                                })
                                            var plivac=new Plivac(el.id,el.jmbg,el.ime,el.prezime,el.pol,el.nivoSpreme,el.datumRodjenja,el.kontakt,list);
                                            listaPlivaca.push(plivac);
                                        })
                                        //ovde za dugme za izbor
                                        var divp = document.createElement("div");
                                        divp.className = "izborKluba";
                                        divp.innerHTML = klub.ime;

                                        poz.appendChild(divp);

                                        divp.onclick=(ev)=>
                                        {
                                            var k=new PlivackiKlub(klub.id,klub.ime,klub.adresa,klub.telefon,klub.email,listaDisciplina,listaPlivaca); 
                                            listaKlubova.push(k);


                                            document.body.removeChild(poz);
                                            
                                            k.crtajGlavniPrikaz(document.body);
                                          
                                        }
                                })
                            }
                            else
                            {
                                p.text().then(data=>
                                    {
                                       alert(data);
                                    })
                                    return;
                            }
                            
                        })
                });
                //dalje
                

            })
    })

            })
    })
