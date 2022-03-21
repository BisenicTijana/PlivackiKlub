import {Plivac} from "./plivac.js"
import { Rez } from "./rez.js";
import {Rezultat} from "./rezultat.js"
import {Takmicenje} from "./takmicenje.js"

export class PlivackiKlub
{
    constructor(id,ime,adresa,brtel,email,listaDisciplina,listaPlivaca)//ok
    {
        this.kontejner=null;
        this.id=id;
        this.ime=ime;
        this.adresa=adresa;
        this.brtel=brtel;
        this.email=email,
        this.listaDisciplina=listaDisciplina;
        this.listaPlivaca=listaPlivaca;
    }
    
    crtajGlavniPrikaz(host)//ok
    {
        if(!host)
            throw new Exception("Roditeljski element ne postoji");

        //KONTEJNER
        this.kontejner=document.createElement("div");
        this.kontejner.className="divGlavniKontejner";
        host.appendChild(this.kontejner);

        //GLAVNI NASLOV
        var d=document.createElement("div");
        d.className="divGlavniNaslov"; 
        this.kontejner.appendChild(d);
        var glavniNaslov=document.createElement("h1");
        glavniNaslov.className="glavniNaslov";
        glavniNaslov.innerHTML=this.ime;
        d.appendChild(glavniNaslov);

        //DUGMICI ZA IZBOR
        d=document.createElement("div");
        d.className="divDugmiciZaIzbor";
        this.kontejner.appendChild(d);
      
        var dugme=document.createElement("button");
        dugme.innerHTML="Članovi";
        dugme.className="dugmeZaIzbor";
        d.appendChild(dugme);
        dugme.onclick=(ev)=>this.crtajFormuPlivac();

        dugme=document.createElement("button");
        dugme.innerHTML="Klub";
        d.appendChild(dugme);
        dugme.className="dugmeZaIzbor";
        dugme.onclick=(ev)=>this.crtajFormuKlub();

        //GLAVNA FORMA
        var form=document.createElement("div");
        form.className="GlavnaForma";
        //form.innerHTML="";
        this.kontejner.appendChild(form);


    }
    crtajRed(host)//ok
    {
        if(!host)
        throw new Exception("Roditeljski element ne postoji");

        let red=document.createElement("div");
        red.className="red";
        host.appendChild(red);
        return red;
    }
    crtajFormuPlivac()//ok
    {
            var glavnaForma=this.obrisiGlavnuFormu();
            this.crtajFormuZaPrikaz(glavnaForma);

    }
    crtajFormuZaPrikaz(host)//ok
    {
        var forma=document.createElement("div");
        forma.className="donjaForma";
        host.appendChild(forma);

        var d=document.createElement("div");
        forma.appendChild(d);
        d.className="ceoPlivac";
        let l=document.createElement("label");
        d.appendChild(l);
        var h3=document.createElement("h3");
        l.appendChild(h3);
        h3.innerHTML="Plivač";
        this.crtajFormuZaPretragu(d);
        this.crtajFormuZaPrikazPlivaca(d);

        this.crtajFormuZaPrikazTakmicenja(forma);
    }
    crtajFormuZaPretragu(host)//ok      //ceoPlivac
    {
         //FORMA ZA PRETRAGU
         var glavnaForma=host;
         var formaPretraga=document.createElement("div");
         formaPretraga.className="formaPretragaPlivac";
         glavnaForma.appendChild(formaPretraga);
         let red;let box;
         
                 red=this.crtajRed(formaPretraga);
                 box=document.createElement("input");
                 box.type="text";
                 box.className="pretraga";
                 formaPretraga.appendChild(red);
                 red.appendChild(box);
         let dugme;
         //red=this.crtajRed(formaPretraga);
         dugme=document.createElement("button");
         dugme.innerHTML="pretrazi";
         dugme.className="dugmePretragaPlivac";
         formaPretraga.appendChild(red);
         red.appendChild(dugme);
        red.className="redPretraga";
         dugme.onclick=(ev)=>
         {
                    //rez ako ima
                    this.obrisiFormuRezultat();
                    
                    //dodatni dugmici ako ih ima
                    var forma=this.kontejner.querySelector(".formaPrikazPlivac");
                    var nivospreme=forma.querySelector("select");
                    var roditelj=nivospreme.parentNode; //red gde je select el
                    this.obrisiRed(roditelj);

                    //isprazni formu
                    let form=this.kontejner.querySelector(".formaPrikazPlivac");
                    this.isprazniPoljaPrikazPlivac(form);

                    //UVEK SE BRISE SVE KAD SE KLIKNE NA PRETRAZI
                    var par=box.value;
                   
                    let q=/^[A-Za-z\s]*$/.test(par);
                    if(q)//samo slova
                    {
                        par=par.split(" ");
                        par=par.filter(el=>/\S/. test(el));
                        if(par.length>2 || par.length==0)//ako ima vise od dve reci, ili nista
                        {
                            alert("Unesite ime, prezime, ili oba!");

                            let forma=this.kontejner.querySelector(".formaPretragaPlivac");
                            let red=forma.querySelector(".izaberiPlivaca");
                            if(red!=null)
                            forma.removeChild(red);
                            return;
                        }
                        //sve ok
                        this.nadjiPlivaca(par[0],par[1]);
                    }
                    else
                    {
                        alert("Niste uneli ime i prezime!");

                        let forma=this.kontejner.querySelector(".formaPretragaPlivac");
                        let red=forma.querySelector(".izaberiPlivaca");
                        if(red!=null)
                        forma.removeChild(red);
                        return;
                           
                    }

         }

    }
    nadjiPlivaca(x,y)//ok
    {
        //napravi red za select i izaberi dugme
        var forma=this.kontejner.querySelector(".formaPretragaPlivac");
        var red,se,dugme;
        let link=`https://localhost:5001/Plivac/UcitajPlivaca?idKlub=${this.id}`;
        if(x || y)
        {
            link+=`&`;
        }
        if(x)
        {
            link+=`x=${x}`;
            if(y)
            {
                link+=`&`;
            }
        }
        if(y)
        {
            link+=`y=${y}`;
        }
        fetch(link,
        {
            method:"GET"
            
        }).then(p=>
            {
                if(p.ok)
                {
                    red=this.obrisiRed(forma);
                    red.classList.add("izaberiPlivaca");
                    se=document.createElement("select");
                    var unos;
                    se.className="selectPretragaPlivac";
                    red.appendChild(se);
                    dugme=document.createElement("button");
                    red.appendChild(dugme);
                    dugme.innerHTML="izaberi";
                    var lista=[];
                    p.json().then(data=>
                        {
                           data.forEach(el=>
                            {
                                //upis u select listu
                                let op;
                                op=document.createElement("option");

                                let dat=new Date(el.datumRodjenja);//formatiranje
                                let xs=dat.toLocaleDateString('sv-SE');

                                unos=el.ime+" "+el.prezime+","+el.nivoSpreme+","+xs;
                                op.innerHTML=unos;
                                op.value=el.id;
                                se.appendChild(op);
                                lista.push(el);
                            })
                            se.selectedIndex=-1;
                            alert("Pretraga uspesna! Mozete izabrati plivaca!");
                            //ovde klik na izaberi
                            dugme.onclick=(ev)=>
                            {//index u listi je isti kao index u select
                                if(se.selectedIndex==-1)
                                {
                                    alert("Niste izabrali plivaca iz liste!");
                                    return;
                                }
                                this.upisiUPrikazPlivac(lista[se.selectedIndex]);//salje se selektovan
                                forma.removeChild(red);//ovo skida taj red kad se izabere
                            }
                           
                        })
                        
                }
                else
                { 
                    p.text().then(data=>
                    {
                       alert(data);
                    })
                    let red=forma.querySelector(".izaberiPlivaca");
                    if(red!=null)
                    forma.removeChild(red);
                    return;
                }
            })
    }
    crtajFormuZaPrikazPlivaca(host) //ok   //ceoPlivac 
    {
        var glavnaForma=host;
        var formaPrikaz=document.createElement("div");
        formaPrikaz.className="formaPrikazPlivac";
        glavnaForma.appendChild(formaPrikaz);
   
        let l;let box;let red;
        let nizEl=["JMBG","Ime","Prezime","DatumRodjenja","Kontakt"];
        let nizTip=["number","text","text","date","text"];
        //ime, prez,jmbg,dat rodj
        nizEl.forEach((el,ind)=>
            {
                red=this.crtajRed(formaPrikaz);
                l=document.createElement("label");
                l.innerHTML=el;
                red.appendChild(l);
                box=document.createElement("input");
                box.type=nizTip[ind];
                formaPrikaz.appendChild(red);
                red.appendChild(box);
                box.classList.add("formaPrikazBox"+nizEl[ind]);
                box.classList.add("formaPrikazBox");
            })
                //radio btn za pol
                nizEl=["M","Z"];
                let divZaRbt=document.createElement("div");
                formaPrikaz.appendChild(divZaRbt);
                divZaRbt.className="divZaRbt";

                let rbt;
                nizEl.forEach((el,ind)=>
                {
                        // dodato da bi labela i dugme bili grupisani
                    let divLabelaDugme = document.createElement('div');
                    divLabelaDugme.className = 'divPol';

                    l=document.createElement("label");
                    l.innerHTML=el;
                    divLabelaDugme.appendChild(l);
                    rbt=document.createElement("input");
                    rbt.type="radio";
                    rbt.value=el;
                    rbt.name="pol";
                  
                    divLabelaDugme.appendChild(rbt); 
                    divZaRbt.appendChild(divLabelaDugme);
                })


                red=this.crtajRed(formaPrikaz);
                nizEl=["takmicar","neplivac","rekreativac"];
                let se=document.createElement("select");
                se.className="selectNivoSpreme"; 
                l=document.createElement("label");
                l.innerHTML="Nivo spreme:";
                red.appendChild(l);
                red.appendChild(se);

                red.className= 'red';
                formaPrikaz.appendChild(red);
                let op;
                nizEl.forEach((el,ind)=>
                    {
                        op=document.createElement("option");
                        op.innerHTML=el;
                        op.value=ind;
                        se.appendChild(op);

                    })
                    op=formaPrikaz.querySelector("select");
                    op.selectedIndex=-1;

            var divPlivacCRUD=document.createElement("div");
            divPlivacCRUD.className="divPlivacCRUD";
            divPlivacCRUD.classList.add("red");
            formaPrikaz.appendChild(divPlivacCRUD);
            var dugme;
            nizEl=["upisi","ispisi","azuriraj"];
            nizEl.forEach((el,ind)=>
                {
                    dugme=document.createElement("button");
                    dugme.innerHTML=el;
                    dugme.className="dugmePlivacCRUD"+ind;
                    
                    divPlivacCRUD.appendChild(dugme);
                })
                dugme=glavnaForma.querySelector(".dugmePlivacCRUD0");//dodaj
                dugme.onclick=(ev)=>
                {
                     this.skupiPlivaca(0);
                }

                dugme=glavnaForma.querySelector(".dugmePlivacCRUD2");//promeni
                dugme.onclick=(ev)=>
                {
                    let jmbg=formaPrikaz.querySelector(".formaPrikazBoxJMBG");
                    if(jmbg.value===null || jmbg.value==="")
                       {
                            alert("Niste izabrali plivaca za azuriranje!");
                            return;
                       } 
                     this.skupiPlivaca(1);
                }
                dugme=glavnaForma.querySelector(".dugmePlivacCRUD1");//obrisi
                dugme.onclick=(ev)=>
                {
                    let jmbg=formaPrikaz.querySelector(".formaPrikazBoxJMBG");
                    if(jmbg.value===null || jmbg.value==="")
                       {
                            alert("Niste izabrali plivaca za brisanje!");
                            return;
                       } 
                    this.obrisiPlivaca(jmbg.value);
                    this.obrisiFormuRezultat();
                }
        
    }
   
    skupiPlivaca(fja)//ok
    {
        let forma=this.kontejner.querySelector(".formaPrikazPlivac");
        let boxEl=forma.querySelectorAll(".formaPrikazBox");
        let nivospreme=forma.querySelector("option:checked");
        let pol=forma.querySelector("input[type='radio']:checked");
        let nizPoruka=["JMBG","Ime","Prezime","datum rodjenja","kontakt","pol","nivo spreme"];
        for(let i=0;i<boxEl.length;i++)
        {
            if(boxEl[i].value===null||boxEl[i].value==="")
            {
                alert("Unesi "+nizPoruka[i]+"!");
                return;
            }
        }
       
        if(pol===null)
        {
            alert("izaberi pol");
            return;
        }
        pol=pol.value;
        
        if(nivospreme===null)
        {
            alert("izaberi nivo spreme");
            return;
        }
        nivospreme=nivospreme.innerHTML;

        if(fja==0)
        {
            this.unesiPlivaca(this.id,boxEl[0].value,boxEl[1].value,boxEl[2].value,
            boxEl[3].value,boxEl[4].value,pol,nivospreme);
        }
        else if(fja==1)
        {
            this.promeniPlivaca(this.id,boxEl[0].value,boxEl[1].value,boxEl[2].value,
             boxEl[4].value,nivospreme);
        }
        else
            return;

    }
    unesiPlivaca(idKlub,jmbg,ime,prezime,datrodj,kontakt,pol,nivospreme)//ok
    {
        fetch("https://localhost:5001/Plivac/DodajPlivaca/"+idKlub+"/"+jmbg+"/"+ime+"/"+prezime+"/"
        +datrodj+"/"+kontakt+"/"+pol+"/"+nivospreme,
        {
            method:"POST"
            
        }).then(p=>
            {
                if(p.ok)
                {
                    p.json().then(data=>
                        {
                            data.forEach(el=>
                                {
                                    const pl=new Plivac(el.id,el.jmbg,el.ime,el.prezime,el.pol,el.nivoSpreme,el.datumRodjenja,el.kontakt,el.plivacNaTakmicenjima);
                                    this.listaPlivaca.push(pl);
                                    this.upisiUPrikazPlivac(el);
                                    alert("plivac dodat u klub!!!");
                                    return;
                                })
                            
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
    }
    promeniPlivaca(idKlub,jmbg,ime,prezime,kontakt,nivospreme)//ok
    {
        let form=this.kontejner.querySelector(".formaPrikazPlivac");
        fetch("https://localhost:5001/Plivac/PromeniPlivaca/"+idKlub+"/"+jmbg+"/"+ime+"/"+prezime+"/"
        +kontakt+"/"+nivospreme,
        {
            method:"PUT" 
        }).then(p=>
            {   
                if(p.ok)
                {
                    p.json().then(data=>
                    {
                        data.forEach(el=>
                            {
                                this.listaPlivaca=this.listaPlivaca.filter(p=>p.jmbg!=jmbg);//izbaci
                                const pl=new Plivac(el.id,el.jmbg,el.ime,el.prezime,el.pol,el.nivoSpreme,el.datumRodjenja,el.kontakt,el.plivacNaTakmicenjima);
                                this.listaPlivaca.push(pl);//dodaj

                                this.isprazniPoljaPrikazPlivac(form);
                                this.upisiUPrikazPlivac(el);

                                alert("Azurirane informacije o plivacu!");
                               
                            })
                        

                    })
                }
                else 
                {
                  p.text().then(data=>
                    {
                       alert(data);
                    })
                    this.listaPlivaca.forEach(el=>
                        {
                            if(el.jmbg==jmbg)
                            this.upisiUPrikazPlivac(el);
                        })
                   
                    //this.isprazniPoljaPrikazPlivac(form);//eventualno ovo
                    //ako dodje do greske, isprazni formu skroz
                    return;
                }
            })
    }
    upisiUPrikazTakmicenje(el)//ok
    {
        var form=this.kontejner.querySelector(".formaPrikazTakmicenje");
        let nizEl=form.querySelectorAll(".formaPrikazBox");
        let dat=new Date(el.datum);//formatiranje
        let xs=dat.toLocaleDateString('sv-SE');
        let nizVrednosti=[el.grad,el.drzava,xs];
        nizEl.forEach((x,ind)=>
            {
                x.value=nizVrednosti[ind];
            })

        let rbt=form.querySelectorAll("input[name='velicina']");
        let op=form.querySelector("select");
        if(el.velicinaBazena==25)
            {
                rbt[0].checked=true;
            }
        else
           {
               rbt[1].checked=true;
           }

        if(el.rang=="miting")
            {
                op.value=0;    
            }
        else if(el.rang=="drzavno")
            op.value=1;
        else if(el.rang=="medjunarodno")
            op.value=2;

        //upis u sel listu info
        var formaPretraga=this.kontejner.querySelector(".formaPretragaTakm");
        var se=formaPretraga.querySelector("select");
        this.obrisiIzSelect(se);
        op=document.createElement("option");
        
        var unos=el.grad+", "+el.drzava+", "+xs+": "+el.rang+", "+el.velicinaBazena+"m";
        
        op.innerHTML=unos;
        
        op.value=el.id;
        se.appendChild(op);

    }
    upisiUPrikazPlivac(el)//ok
    {
        
        var form=this.kontejner.querySelector(".formaPrikazPlivac");
        let nizEl=form.querySelectorAll(".formaPrikazBox");
        let dat=new Date(el.datumRodjenja);//formatiranje
        let xs=dat.toLocaleDateString('sv-SE');
        el.ime=el.ime.charAt(0).toUpperCase()+el.ime.slice(1);
        el.prezime=el.prezime.charAt(0).toUpperCase()+el.prezime.slice(1);
        let nizVrednosti=[el.jmbg,el.ime,el.prezime,xs,el.kontakt];
        nizEl.forEach((x,ind)=>
            {
                x.value=nizVrednosti[ind];
            })

        let rbt=form.querySelectorAll("input[name='pol']");
        let op=form.querySelector("select");
        if(el.pol==='M')
            {
                rbt[0].checked=true;
            }
        else
           {
               rbt[1].checked=true;
           }

        if(el.nivoSpreme=="takmicar")
            {
                op.value=0;    
            }
        else if(el.nivoSpreme==="neplivac")
            op.value=1;
        else if(el.nivoSpreme=="rekreativac")
            op.value=2;

        var forma=this.kontejner.querySelector(".formaPrikazPlivac");
        var nivospreme=forma.querySelector("select");
        var roditelj=nivospreme.parentNode; //red gde je select el
        
        var dugme;
        if(el.nivoSpreme=="takmicar")
        {
               var x=this.kontejner.querySelector(".celoTakm");
               dugme=document.createElement("button");
               dugme.className="dugmeRez";
               let red=this.obrisiRed(roditelj);
               
               red.appendChild(dugme);
               roditelj.appendChild(red);
               dugme.innerHTML="najbolji rezultat";

               dugme.onclick=(ev)=>
               {
                    this.obrisiFormuRezultat();
                    let forma=this.crtajFormuZaRezultat(x);
                    this.crtajFormuZaNajboljiRezultat(forma);
               }

               dugme=document.createElement("button");
               dugme.className="dugmeRez";
               red.appendChild(dugme);
               roditelj.appendChild(red);
               dugme.innerHTML="dodaj rezultat";

              
               dugme.onclick=(ev)=>
               {
                    this.obrisiFormuRezultat();
                    let forma=this.crtajFormuZaRezultat(x);
                    this.crtajFormuZaDodavanjeRezultata(forma);
               }
                
        }
        else
        {
             this.obrisiRed(roditelj);
             this.obrisiFormuRezultat();
        }     

    }
    obrisiRed(host)//ok                           //host je red gde je select i dugme
    {
        if(host!=null)
        {
           let red=host.querySelector(".red");
           if(red!=null)
                host.removeChild(red);
           red=this.crtajRed(host);

           return red;
        }
    }
    obrisiPlivaca(jmbg)//ok
    {
        fetch("https://localhost:5001/Plivac/ObrisiPlivaca/"+this.id+"/"+jmbg,
        {
            method:"DELETE"
        }).then(p=>
            {
                if(p.ok)
                {
                    p.text().then(data=>
                        {
                           alert(data);
                        })
                        let form=this.kontejner.querySelector(".formaPrikazPlivac");
                        //treba da se obrise forma za takm, polje za pretragu i da se maknu dugmici
                        var red=form.querySelector("select");
                        var roditelj=red.parentNode;
                        this.obrisiRed(roditelj);
                        this.isprazniPoljaPrikazPlivac(form);
                        this.obrisiFormuRezultat();
                        this.listaPlivaca=this.listaPlivaca.filter(p=>p.jmbg!=jmbg);
                        let pretraga=this.kontejner.querySelector(".pretraga");
                        pretraga.value="";

                }
               
               else 
                {
                   p.text().then(data=>
                    {
                       alert(data);
                    })
                }
                
            })
    }
    isprazniPoljaPrikazPlivac(host)//ok
    {
        //text box
        let listaBox=(host.querySelectorAll(".formaPrikazBox"));
        if(listaBox!=null)
        {
            listaBox.forEach(el=>
                {
                    el.value="";
                })
        }
        //select
        let op=host.querySelector("select");
        op.selectedIndex=-1;
        //rbt
      
        let rbt=host.querySelector("input[type='radio']:checked");
        if(rbt!=null)
        {
            rbt.checked=false;
        }

    }
    crtajFormuZaPrikazTakmicenja(host)//ok
    {
        var d=document.createElement("div");
        host.appendChild(d);
        d.className="celoTakm";
        let labbb=document.createElement("label");
        d.appendChild(labbb);
       var  h3=document.createElement("h3");
        labbb.appendChild(h3);
        h3.innerHTML="Takmičenje";

        var x =document.createElement("div");
        x.className="formaPretragaTakm";
        d.appendChild(x);
        

        let forma=document.createElement("document");
        forma.className="formaPrikazTakmicenje";
        d.appendChild(forma);

        let red;let l;
        red=this.crtajRed(x);
        red.className="redPretraga";
        let sel=document.createElement("select");
        red.appendChild(sel);
        var dugme;
        dugme=document.createElement("button");
        red.appendChild(dugme);
        dugme.innerHTML="izaberi";
        dugme.onclick=(ev)=>
        {
            this.citajIzSelect();
           
        }

        //RANG
        let nizEl=["miting","drzavno","medjunarodno"];
        l=document.createElement("label");
        l.innerHTML="Rang";

        let se=document.createElement("select");
        se.className="selectEl";
        red=this.crtajRed(forma);
        red.appendChild(l);
        red.appendChild(se);
        forma.appendChild(red);
        
        
        let op;
        nizEl.forEach((el,ind)=>
            {
                op=document.createElement("option");
                op.innerHTML=el;
                op.value=ind;
                se.appendChild(op);

            })
            op=forma.querySelector(".selectEl");
            op.selectedIndex=-1;
            //VELICINA RBT
        nizEl=[25,50];
        let divZaRbt=document.createElement("div");
        forma.appendChild(divZaRbt);
        divZaRbt.className="divZaRbt";
        let rbt;
        nizEl.forEach((el,ind)=>
        {
            let divLabelaDugme = document.createElement('div');
            divLabelaDugme.className = 'divPol'; 

            l=document.createElement("label");
            l.innerHTML=el+"m";
            divLabelaDugme.appendChild(l);
            rbt=document.createElement("input");
            rbt.type="radio";
            rbt.value=el;
            rbt.name="velicina";
            divLabelaDugme.appendChild(rbt);
            divZaRbt.appendChild(divLabelaDugme);
        })

        //TEXTBOX
        nizEl=["Grad","Drzava","Datum"];
        let nizTip=["text","text","date"];
        let box;
        nizEl.forEach((el,ind)=>
            {
                red=this.crtajRed(forma);
                l=document.createElement("label");
                l.innerHTML=el;
                red.appendChild(l);
                box=document.createElement("input");
                box.type=nizTip[ind];
                forma.appendChild(red);
                red.appendChild(box);
                box.classList.add("formaPrikazBox"+nizEl[ind]);
                box.classList.add("formaPrikazBox");
            })
        //DUGMICI
            red=this.crtajRed(forma);
            forma.appendChild(red);
            

            dugme=document.createElement("button");
            dugme.innerHTML="dodaj";
            red.appendChild(dugme);
            dugme.onclick=(ev)=>
            {
                var parametri=this.skupiTakmicenje(forma);
                if(parametri.length!=5)
                        return;
                this.dodajTakmicenje(parametri[0],
                    parametri[1],parametri[2],parametri[3],parametri[4]);
            }

           

            dugme=document.createElement("button");
            dugme.innerHTML="azuriraj";
            red.appendChild(dugme);
            dugme.onclick=(ev)=>
            {
                //proveri jel nesto izabrano
                var unos=sel.options[sel.selectedIndex];
                if(unos==undefined)
                {
                    alert("Niste izabrali takmicenje!");
                    return;
                }
                let id=unos.value;
                //skupi vel baz i rang
                rbt=forma.querySelector("input[type='radio']:checked");
                let selectelement=forma.querySelector(".selectEl");
                let se=selectelement.querySelector("option:checked");
                
                if(se===null || se=="")
                {
                    alert("izaberite rang takmicenja!");
                        return;
                }
                else
                {
                    if(se.value==0)
                    se="miting";
                    else if(se.value==1)
                    se="drzavno";
                    else
                    se="medjunarodno";
                }

                if(rbt===null)
                {
                    alert("izaberi velicinu bazena");
                    return;
                }
                else
                {
                    rbt=rbt.value;
                }
                this.promeniTakmicenje(id,se,rbt);
            }
            dugme=document.createElement("button");
            dugme.innerHTML="pretrazi";
            red.appendChild(dugme);
            dugme.onclick=(ev)=>
            {
                this.nadjiTakmicenje(forma); //forma prikaz takm
            } 

    }
    promeniTakmicenje(id,rang,vel)//ok
    {
        let f=this.kontejner.querySelector(".celoTakm");
        let sel=f.querySelector("select");
        fetch("https://localhost:5001/Takmicenje/PromeniTakmicenje/"+id+"/"+rang+"/"+vel,
        {
            method:"PUT"
            
        }).then(p=>
            {
                if(p.ok)
                {
                    p.json().then(data=>
                        {
                            //console.log(data);
                            {
                                this.obrisiIzSelect(sel);
                                let op;
                                op=document.createElement("option");
                                op.innerHTML= data.grad+", "+data.drzava+": "+data.rang+", "+data.velicinaBazena+"m";
                                op.value=data.id;
                                sel.appendChild(op);

                                //popuni sva polja opet
                                this.upisiUPrikazTakmicenje(data);
                            }
                        })
                        alert("Informacije o takmicenju su azurirane!");
                }
                else 
                {
                   p.text().then(data=>
                    {
                       alert(data);
                    })
                    this.citajIzSelect();
                    return;
                }
                    
               
            })
            
    }
    citajIzSelect()//ok
    {
        var forma=this.kontejner.querySelector(".formaPrikazTakmicenje");
        let f=this.kontejner.querySelector(".celoTakm");
        let sel=f.querySelector("select"); //za izbor
        var unos=sel.options[sel.selectedIndex];

        if(unos==undefined)
        {
            alert("nista niste izabrali!");
                return;
        }
        //ako je izabrano

        let se=forma.querySelector(".selectEl");
            unos=unos.text;
            unos=unos.split(',').join('');
            unos=unos.split(':').join('');
            let txt=unos.split(' ');//ovde su el za unos
          
            let datum=new Date(txt[2]);
            let xs=datum.toLocaleDateString('sv-SE');
            let nizEl=forma.querySelectorAll(".formaPrikazBox");
            let nizVr=[txt[0],txt[1],xs];//grad, drzava, datum

            nizEl.forEach((el,ind)=>
            {
                el.value=nizVr[ind];
            })

           if(txt[3]==="miting")
           {
                se.value=0;
           }
           else if(txt[3]==="drzavno")
           {
                se.value=1;
           }
           else
               se.value=2;
           
            let  rbt=forma.querySelectorAll("input[name='velicina']");
            if(txt[4]==="25m")
            {
                rbt[0].checked=true;
            }
            else
            {
                rbt[1].checked=true;
            }
                 
    }
    obrisiIzSelect(el)//ok     //salje se sel el
    {
        while (el.length > 0) 
        {
            el.remove(0);
        }
    }
    nadjiTakmicenje(host)//ok
    {
        var datPolje=host.querySelector(".formaPrikazBoxDatum");
        var gradPolje=host.querySelector(".formaPrikazBoxGrad");
        var dat=datPolje.value;
        var unos;
        var grad=gradPolje.value;

        let link=`https://localhost:5001/Takmicenje/NadjiTakmicenje`;
        if(grad || dat)
        {
            link+=`?`;
        }
        if(dat)
        {
            link+=`dat=${dat}`;
            if(grad)
            {
                link+=`&`;
            }
        }
        if(grad)
        {
            link+=`grad=${grad}`;
        }
        this.isprazniPoljaPrikazTakmicenje(host);
           //upisi datum u polje za datum
        datPolje.value=dat;
        gradPolje.value=grad;
           //brisanje elm iz select
        var formaPretraga=this.kontejner.querySelector(".formaPretragaTakm");
        var se=formaPretraga.querySelector("select");
        this.obrisiIzSelect(se);


        fetch(link,
        {
            method:"GET"
            
        }).then(p=>
            {
                if(p.ok)
                {
                    p.json().then(data=>
                        {
                           data.forEach(a=>
                            {
                                //upis u select listu
                                let op;
                                op=document.createElement("option");
                                
                                let datum=new Date(a.datum);
                                let xs=datum.toLocaleDateString('sv-SE');
                                
                                unos=a.grad+", "+a.drzava+", "+xs+": "+a.rang+", "+a.velicinaBazena+"m";
                       
                                op.innerHTML=unos;
                                op.value=a.id;
                                se.appendChild(op);

                            })
                     
                           alert("Pretraga uspesna!Sada mozete izabrati takmicenje!");
                            se.selectedIndex=-1;
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
    }
    isprazniPoljaPrikazTakmicenje(host)//ok
    {
        if(!host)
            throw new Exception("Ne postoji roditelj!");

        let listaBox=(host.querySelectorAll(".formaPrikazBox"));
        if(listaBox!=null)
        {
            listaBox.forEach(el=>
                {
                    el.value="";
                })
        }
        //select
        let op=host.querySelector(".selectEl");
        op.selectedIndex=-1;
        //rbt
        let rbt=host.querySelector("input[type='radio']:checked");
        if(rbt!=null)
        {
            rbt.checked=false;
        }
    }
    skupiTakmicenje(host)//ok       //forma prikaz takm
    {
        if(!host)
            throw new Exception("Ne postoji roditelj!");

        let rbt=host.querySelector("input[type='radio']:checked");
        let selectelement=host.querySelector(".selectEl");
        let se=selectelement.querySelector("option:checked");
        //console.log(se.value);
        if(se===null || se=="")
        {
            alert("izaberite rang takmicenja!");
           return [];
           
        }
        else
        {
            if(se.value==0)
            se="miting";
            else if(se.value==1)
            se="drzavno";
            else
            se="medjunarodno";
        }

        if(rbt===null)
        {
            alert("izaberi velicinu bazena");
            return [];
        }
        else
        {
            rbt=rbt.value;
        }
        //textbox el
        let boxEl=host.querySelectorAll(".formaPrikazBox");

        let nizPoruka=["Grad","Drzava","Datum"]
        for(let i=0;i<boxEl.length;i++)
        {
            if(boxEl[i].value===null||boxEl[i].value=="")
            {
                alert("Unesi "+nizPoruka[i]);
                return [];
            }
        }
        
       //rang,vel,grad,drzava,datum
        var parametri=[se,rbt,boxEl[0].value,boxEl[1].value,boxEl[2].value];
        return parametri;
    }
    dodajTakmicenje(rang,vel,grad, drzava,datum)//ok
    {
        fetch("https://localhost:5001/Takmicenje/DodajTakmicenje/"+rang+"/"+vel+"/"+grad+"/"
        +drzava+"/"+datum,
        {
            method:"POST"
            
        }).then(p=>
            {
                if(p.ok)
                {
                    p.json().then(data=>
                        {
                            {
                                let forma=this.kontejner.querySelector(".celoTakm");
                                let se=forma.querySelector("select");
                                this.obrisiIzSelect(se);
                                let op;
                                op=document.createElement("option");
                                let datum=new Date(data.datum);
                                let xs=datum.toLocaleDateString('sv-SE');
                                op.innerHTML= data.grad+", "+data.drzava+", "+xs+": "+data.rang+", "+data.velicinaBazena+"m";
                                op.value=data.id;
                                se.appendChild(op);
                            }
                        })
                        alert("Takmicenje dodato u bazu!");
                }
                else 
                {
                   p.text().then(data=>
                    {
                       alert(data);
                       return;
                    })

                   
                }
               
            })
    }
    crtajFormuZaRezultat(host)//ok
    {
        if(!host)
            throw new Exception("Ne postoji host");

        let forma=document.createElement("div");
        forma.className="formaRezultat";
        host.appendChild(forma);
        return forma;

    }
    crtajFormuZaNajboljiRezultat(host)//ok
    {
        if(!host)
            throw new Exception("Ne postoji host");

        var forma=document.createElement("div");
        forma.className="formaPretragaNajRez";
        host.appendChild(forma);
        
        let red=this.crtajRed(forma);
        forma.appendChild(red);
        let se=document.createElement("select");
        red.appendChild(se);
        let op;let l;
        this.listaDisciplina.forEach((el,ind)=>
        {
            op=document.createElement("option");
            op.innerHTML=el.distanca+"  "+el.stil;
            op.value=ind+1;
            se.appendChild(op);
        })
        op=forma.querySelector("select");
        op.selectedIndex=-1;
        //radio dugmici

        red=this.crtajRed(forma);
        red.className="divZaRbt";
        forma.appendChild(red);

        let nizEl=["PLASMAN","VREME"];
        let rbt;
        nizEl.forEach((el,ind)=>
        {
            let divLabelaDugme = document.createElement('div');
            divLabelaDugme.className = 'divIzbor';

            l=document.createElement("label");
            l.innerHTML=el;
            divLabelaDugme.appendChild(l);
            rbt=document.createElement("input");
            rbt.type="radio";
            rbt.value=el;//ind?
            rbt.name="izborRez";
           // console.log(rbt);
           divLabelaDugme.appendChild(rbt);
           red.appendChild(divLabelaDugme);
        })

        //TABELA!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let dugme=document.createElement("button");
        dugme.className="btnNajRez";
        red=this.crtajRed(forma);
        red.appendChild(dugme);
        dugme.innerHTML="pretrazi";

        dugme.onclick=(ev)=>
        {
            //moraju da se skupe vrednosti pre nego se crta tabela
            let disc=forma.querySelector("option:checked");
            
            if(disc===null || disc==="")
                {
                    alert("Morate izabrati disciplinu za pretragu!");
                    return;
                }

            let tmp=forma.querySelector("input[type='radio']:checked");
            if(tmp===null)
            {
                alert("Morate izabrati kriterijum pretrage!");
                return;
            }

            
            //ovde skupi sve iz forme
            if(tmp.value==="PLASMAN")
                tmp=1;
            else
                tmp=0;
            this.upisiNajboljeRezultate(forma,disc.value,tmp);
        }
       

    }
    upisiNajboljeRezultate(host,idDisciplina,izbor)//ok
    {
        //jmbg iz forme za plivaca
        var prikaz=this.kontejner.querySelector(".formaPrikazPlivac");
        var jmbg=(prikaz.querySelector(".formaPrikazBoxJMBG")).value;
        if(jmbg==="" && jmbg===null)
        {
            alert("Niste izabrali plivaca!");
            return;
        }
        fetch("https://localhost:5001/Plivac/NajboljiRezultat/"+this.id+"/"+jmbg+"/"
        +idDisciplina+"/"+izbor,
        {
            method:"GET"
        }).then(p=>
            {
                if(p.ok)
                {
                   let d=this.obrisiTabelu(host);//saljemo roditelja
                   var tabelaBody=this.crtajTabeluHeader(d);
                   p.json().then(data=>
                    {
                        data.forEach(el=>
                            {
                               // console.log(el);
                                let disc=this.listaDisciplina.find(el=>el.id==idDisciplina);
                                
                                var rez=new Rezultat(el.datum,disc.distanca,disc.stil,el.rezultat,el.plasman);
                               // console.log(rez); 
                               rez.crtajTabeluPod(tabelaBody);
                            })
                    })

                }
                else
                {
                    let d=this.obrisiTabelu(host);
                    p.text().then(data=>
                        {
                           alert(data);
                        })
                }
            })
    }
    crtajTabeluHeader(host)//ok
    {
        
       
       var tabela=document.createElement("table");
       tabela.className="tabela";
       host.appendChild(tabela);

       var tabelaHead=document.createElement("thead");
       tabela.appendChild(tabelaHead);

       var tr=document.createElement("tr");
       tabelaHead.appendChild(tr);

       var tabelaBody=document.createElement("tbody");
       tabelaBody.className="tabelaPodaci";
       tabela.appendChild(tabelaBody);

       let th;
       var zag=["Datum","Disciplina","Vreme","Plasman"];
       zag.forEach(el=>{
           th=document.createElement("th");
           th.innerHTML=el;
           tr.appendChild(th);
       })
       return tabelaBody;
    }
    crtajFormuZaDodavanjeRezultata(host)//ok
    {
        var forma=document.createElement("div");
        forma.className="formaDodajRez";
        host.appendChild(forma);
        let l;
        //disciplina
        let red=this.crtajRed(forma);
        l=document.createElement("label");
        l.innerHTML="Disciplina";
        red.appendChild(l);
        forma.appendChild(red);
        let se=document.createElement("select");
        red.appendChild(se);
        let op;
       
        this.listaDisciplina.forEach((el,ind)=>
        {
            op=document.createElement("option");
            op.innerHTML=el.distanca+"  "+el.stil;
            op.value=ind+1;
            se.appendChild(op);
        })
        op=forma.querySelector("select");
        op.selectedIndex=-1;

        //plasman i vreme txt
        let nizEl=["Plasman","Vreme"];
        let tip=["number","text"];
        let box;
        nizEl.forEach((el,ind)=>
            {
                red=this.crtajRed(forma);
                l=document.createElement("label");
                l.innerHTML=el;
                red.appendChild(l);
                box=document.createElement("input");
                box.type=tip[ind];
                forma.appendChild(red);
                red.appendChild(box);
                box.classList.add("formaPrikazBox"+nizEl[ind]);
                box.classList.add("formaPrikazBox");
            })
           // box=forma.querySelector(".formaPrikazBoxVreme");
            //box.defaultValue="00:00:00";
            red=this.crtajRed(forma);
            forma.appendChild(red);
            var dugme;
          
            dugme=document.createElement("button");
            dugme.innerHTML="dodaj rezultat";
            red.appendChild(dugme);
            dugme.onclick=(ev)=>
            {
                
                let p=this.kontejner.querySelector(".formaPretragaTakm");
                let takm=p.querySelector("select");
                if(takm.selectedIndex==-1)
                {
                    alert("Izaberite takmicenje!");
                    return;
                }
               let idTakm=takm.options[takm.selectedIndex].value;
               let jmbg=this.kontejner.querySelector(".formaPrikazBoxJMBG").value;
               if(jmbg==="" || jmbg===null && jmbg===undefined)
               {
                   alert("Izaberite plivaca!");
                   return;
               }
               let op=forma.querySelector("select");
               if(op.selectedIndex==-1)
               {
                   alert("Izaberite disciplinu!");
                   return;
               }
               let idDisc=op.options[op.selectedIndex].value;
               let boxEl=host.querySelectorAll(".formaPrikazBox");
                    let nizPoruka=["Plasman","Vreme"];
                    for(let i=0;i<boxEl.length;i++)
                    {
                        if(boxEl[i].value===null||boxEl[i].value=="")
                        {
                            alert("Unesi "+nizPoruka[i]);
                            return;
                        }
                    }
                //PROVERA DA LI JE FORMAT REZ OK
                let q=/^([0-9]{0,1}[0-9]\:){2}([0-9]{0,1}[0-9])$/.test(boxEl[1].value);
                if(!q)
                {
                        alert("Neispravan format rezultata! Format je 00:00:00");
                        return;
                }
                //fetch

        fetch("https://localhost:5001/Plivac/DodajRezultat/"+this.id+"/"+jmbg+"/"
        +idDisc+"/"+idTakm+"/"+boxEl[0].value+"/"+boxEl[1].value,
        {
            method:"POST"
        }).then(p=>
            {
                if(p.ok)
                {
                   p.json().then(data=>
                    {
                       // console.log(data);
                        data.forEach(el=>
                            {
                                //dodaj u listu rez
                                //alert da je rez dodat
                                let pl=this.listaPlivaca.find(p=>p.jmbg==jmbg);
                                let rez=new Rez(el.plasman,el.godina);
                                pl.ucestvuje.push(rez);
                                alert("Dodat rezultat: "+el.distanca+" "+el.stil+": "+el.plasman+"; "+el.rezultat+", "+el.grad+", "+el.drzava)
                            })
                    })

                }
                else
                {
                    p.text().then(data=>
                        {
                           alert(data);
                        })
                }
            })


                
            }
    }
    obrisiTabelu(host)//ok
    {

        let tabl=host.querySelector(".formaTabela");
        if(tabl!=null)
            host.removeChild(tabl);

        let d=document.createElement("div");
            d.className="formaTabela";
            host.appendChild(d);

            return d;
    }
    
    obrisiGlavnuFormu()//ok
    {
        var forma =this.kontejner.querySelector(".GlavnaForma");
        if(forma!=null)
        this.kontejner.removeChild(forma);

        forma=document.createElement("div");
        forma.className="GlavnaForma";
        this.kontejner.appendChild(forma);
        return forma;
    }
    obrisiFormuRezultat()//ok
    {
        var forma=this.kontejner.querySelector(".formaRezultat");
        //var roditelj=this.kontejner.querySelector(".donjaForma");
        var roditelj=this.kontejner.querySelector(".celoTakm");
        if(forma!=null && roditelj!=null)
        {
            roditelj.removeChild(forma);
        }
    }
    crtajFormuKlub()//ok
    {
        var formaGl=this.obrisiGlavnuFormu();
        var forma=document.createElement("div");
        formaGl.appendChild(forma);
        forma.className="klub";
        //div za prikaz info
        var klub=document.createElement("div");
        forma.appendChild(klub);
        klub.className="formaKlub";
        //naslov
        var h3=document.createElement("h3");
        h3.innerHTML="Informacije o klubu";
        klub.appendChild(h3);
        h3.className="klubnaslov";
        //forma info klub
        var infoKlub=document.createElement("div");
        klub.appendChild(infoKlub);
        infoKlub.className="formaInfoKlub";
        //forma brojevi klub
        var brojevi=document.createElement("div");
        klub.appendChild(brojevi);
        brojevi.className="formaBrojevi";
        //forma pretraga klub
        var pretragaKlub=document.createElement("div");
        klub.appendChild(pretragaKlub);
        pretragaKlub.className="formaPretragaKlub";
        //info klub
        this.crtajInfoKlub(infoKlub);
        var nizTxt;
        var nizEl;let l;let red;
       
       let d; let x; let q; q=document.createElement("div");let lab=document.createElement("div");
       
       nizTxt=["takmicari","neplivaci","rekreativci","ukupno"];
       let brtakm=this.listaPlivaca.filter(p=>p.nivoSpreme=="takmicar").length;
       let brnepl=this.listaPlivaca.filter(p=>p.nivoSpreme=="neplivac").length;
       let brrekr=this.listaPlivaca.filter(p=>p.nivoSpreme=="rekreativac").length;
       let br=this.listaPlivaca.length;
       nizEl=[brtakm,brnepl,brrekr,br];
       nizTxt.forEach((el,ind)=>
       {
           d=document.createElement("div");
           l=document.createElement("label");
           l.innerHTML=el;
           d.appendChild(l);
           d.className=el;
           lab.appendChild(d);

           x=document.createElement("div");
           q.appendChild(x);
           x.className="br";
           x.innerHTML=nizEl[ind];
           
       })
       brojevi.appendChild(lab);
       brojevi.appendChild(q);
       lab.className="brLab";
       q.className="brDiv";

        //forma za pretragu .pretragaKlub 
        let nasl=document.createElement("h4");
        pretragaKlub.appendChild(nasl);
        nasl.innerHTML="prikazi statistiku uspeha kluba";

        let txt=document.createElement("input");
        txt.className="inputGodina";
        txt.type="number";
        red=this.crtajRed(pretragaKlub);
        l=document.createElement("label");
        l.innerHTML="Godina: ";
        red.appendChild(l);
        red.appendChild(txt);

        red=this.crtajRed(pretragaKlub);
        let dugme=document.createElement("button");
        dugme.innerHTML="pretrazi";
        red.appendChild(dugme);
        dugme.onclick=(ev)=>
        {
            this.crtajStatistiku(forma);//salje se glavna forma
        }
        
    }
    crtajInfoKlub(infoKlub)//ok
    {
        if(infoKlub==null)
            throw new Exception("Nevalidan host za crtanje!");
           
            let l;let red; 
            var nizTxt=["Adresa: ","Telefon: ","Email: "];
            var lista=["adr","tel","email"];
            var nizEl=[this.adresa,this.brtel,this.email];
     
            for(let i=0;i<3;i++)
            {
                red=this.crtajRed(infoKlub);
                red.classList.add(lista[i]);
                l=document.createElement("label");
                l.innerHTML=nizTxt[i];
                red.appendChild(l);

                if(nizEl[i]===null)
                {
                   nizEl[i]="";
                }
                l=document.createElement("label");
                l.innerHTML=nizEl[i];
                l.className="l"+lista[i];
                red.appendChild(l);

            }

            //izmeni
            red=this.crtajRed(infoKlub);
            let cb=document.createElement("input");
            cb.type="checkbox";
            //cb.value=ind;
            red.appendChild(cb);
            l=document.createElement("label");
            l.innerHTML="Izmena?";
            red.appendChild(l);
            red.classList.add("izmenaKlub");
            let txt;
            //"adr","tel","email"
            cb.onclick=(ev)=>
            {
                let vr=["tel","email"];
                let tip=["number","text"];
              
                if(cb.checked)
                {
                    //brisi labele za broj i email
                    //nacrtaj txt
                    //dodaj dugme 
                    vr.forEach((el,ind)=>
                        {
                            let x=infoKlub.querySelector(".l"+el);
                            red=infoKlub.querySelector("."+el);
                            red.removeChild(x);
                            txt=document.createElement("input");
                            txt.type=tip[ind];
                            red.appendChild(txt);
                            txt.classList.add("formaPrikazBox");
                            txt.classList.add("formaPrikazBox"+el);
                        })

                    let dugme=document.createElement("button");
                    red=infoKlub.querySelector(".izmenaKlub");
                    red.appendChild(dugme);
                    dugme.className="promeniKlub";
                    dugme.innerHTML="promeni";
                    dugme.onclick=(ev)=>{this.azurirajKlub(infoKlub);}//klikom na dugme se azuriraju vrednosti, odcekira se ovo i brise se dugme
                    
                }
                else
                {
                    //brisi txt i dugme
                    //crtaj labele i upisi vr
                    this.srediInfo(infoKlub,this.brtel,this.email);

                }
                
            }
        

    }
    srediInfo(infoKlub,brtel,mail)//ok
                {
                    let red,l;let vr=["tel","email"];
                    let unos=[brtel,mail];//ovo ce da bude parametar fje, sta da se upise
                    vr.forEach((el,ind)=>
                        {
                            let x=infoKlub.querySelector(".formaPrikazBox"+el);//telefon
                            red=infoKlub.querySelector("."+el);
                            red.removeChild(x);
                            l=document.createElement("label");
                            red.appendChild(l);
                            l.innerHTML=unos[ind];
                            l.className="l"+el;
                        })

                        //obrisi dugme
                        let dugme=infoKlub.querySelector(".promeniKlub");
                        red=infoKlub.querySelector(".izmenaKlub");
                        red.removeChild(dugme);

                        //odcekiraj
                        let cb=infoKlub.querySelector("input[type='checkbox']:checked");
                        
                        if(cb)
                        cb.checked=false;
                    
                }
    azurirajKlub(host)//ok
    {
        let tel=host.querySelector(".formaPrikazBoxtel").value;
        let email=host.querySelector(".formaPrikazBoxemail").value;
        if(tel=="" && email=="")
           {
                alert("Morate uneti vrednost u bar jedno polje kako bi se azurirale informacije!");
                return;
           } 
        if(tel=="")
            tel=this.brtel;
        if(email=="")
            email=this.email;
        
        fetch("https://localhost:5001/Klub/PromeniKlub/"+this.id+"/"+tel+"/"+email,
        {
            method:"PUT"
            
        }).then(p=>
            {
                if(p.ok)
                {
                    p.json().then(data=>
                        {
                            this.brtel=data.brTelefona;
                            this.email=data.email;
                            this.srediInfo(host,this.brtel,this.email);
                        })
                }
                else 
                {
                   p.text().then(data=>
                    {
                       alert(data);
                       return;//proveri
                    })

                  
                }
               
            })
    }
    crtajStatistiku(host)//ok
    {
        var txt=host.querySelector(".inputGodina");
        txt=txt.value;//godina za pretragu

        var forma=this.obrisiStatistiku(host);//salje se glavna forma
         //naslov
         var h3=document.createElement("h3");
         h3.innerHTML="Statistika kluba";
         forma.appendChild(h3);
         h3.className="klubnaslov";

        //treba mi kolko ukupnp ucestvuje, kolko ukupno ima medalja i kolko svaka posebno ima
        let ukupno=0;
        let zl=0;
        let sr=0;
        let br=0;


        let list=this.listaPlivaca.filter(p=>p.ucestvuje.length!=0); //vrati sve koji su ucestvovali
        list.forEach(el=>
            {
                if(txt=="")
                {
                    zl+=el.ucestvuje.filter(p=>p.plasman==1).length;
                    sr+=el.ucestvuje.filter(p=>p.plasman==2).length;
                    br+=el.ucestvuje.filter(p=>p.plasman==3).length;
                    ukupno+=el.ucestvuje.length;
                }
                else
                {

                    zl+=el.ucestvuje.filter(p=>p.plasman==1 && p.godina==txt).length;
                    sr+=el.ucestvuje.filter(p=>p.plasman==2 && p.godina==txt).length;
                    br+=el.ucestvuje.filter(p=>p.plasman==3 && p.godina==txt).length;
                    ukupno+=el.ucestvuje.filter(p=>p.godina==txt).length;

                }
            })
    
       // medalje=zl+sr+br;
        this.crtajPostolje(zl,sr,br,forma);
        this.crtajVrstu(zl+sr+br,ukupno,forma)

    }
    crtajPostolje(zl,sr,br,host)//ok     //racuna se kao br osvojenih zlatnih u odnosu na br osvojenih medalja
    {
       
        //div za postolje
        
        var forma2=document.createElement("div");
        forma2.className="formaCrtajPostolje";
        host.appendChild(forma2);
      var h2=document.createElement("h5");
       forma2.appendChild(h2);
       h2.innerHTML="*Statistika osvojenih medalja po plasmanu";
       // forma2.innerHTML="*Statistika osvojenih medalja po plasmanu";
        var forma=document.createElement("div");
        forma.className="formaPostolje";
        forma2.appendChild(forma);
        var listaDiv=["drugo","prvo","trece"];let div;let l;
        var listaVelikiDiv=["velikidrugo","velikiprvo","velikitrece"];let vdiv;
        listaDiv.forEach(el=>
            {
                l=document.createElement("label");
                l.className="l"+el;
                div=document.createElement("div");
                vdiv=document.createElement("div");
                div.className=el;
                vdiv.appendChild(l);
                vdiv.appendChild(div);
                forma.appendChild(vdiv);
                //div.innerHTML=el;

            })
        let mini1,mini2,mini3;
        let prvo=forma.querySelector(".prvo");
        let drugo=forma.querySelector(".drugo");
        let trece=forma.querySelector(".trece");
        //onoliko malih divova koliko ima osvojenih medalja ukupno
        let ukupanbr=zl+sr+br;
        let zlatno=zl;let srebrno=sr;let bronzano=br;
        for(let i=0;i<ukupanbr;i++)
           {
                mini1=document.createElement("div");
                mini2=document.createElement("div");
                mini3=document.createElement("div");
                prvo.appendChild(mini1);
                drugo.appendChild(mini2);
                trece.appendChild(mini3);
                mini1.className="prazno";
                mini2.className="prazno";
                mini3.className="prazno";

                if(zl>0)
                {
                    mini1.className="zlatna"; 
                    zl--;
                }
                if(sr>0)
                {
                    mini2.className="srebrna"; 
                    sr--;
                } 
                if(br>0)
                {
                    mini3.className="bronzana"; 
                    br--;
                }
           }          
                        
                       
        let l1=forma.querySelector(".lprvo");
        let l2=forma.querySelector(".ldrugo");
        let l3=forma.querySelector(".ltrece");   
        
        if(ukupanbr==0)
        {
            alert("Ove godine niko nije osvojio medalju na takmicenju!");
            l1.innerHTML="0"+"%";
            l2.innerHTML="0"+"%";
            l3.innerHTML="0"+"%";
        }
        else
        {
            l1.innerHTML=((zlatno/ukupanbr)*100).toFixed(2)+"%";
            l2.innerHTML=((srebrno/ukupanbr)*100).toFixed(2)+"%";
            l3.innerHTML=((bronzano/ukupanbr)*100).toFixed(2)+"%";
        }
    }
    crtajVrstu(medalje,ukupanbr,host)//procenat osvojenih medalja u odnosu na sve koji su ucestvovali
    {
        
        //div za ceo deo
        var forma=document.createElement("div");
        host.appendChild(forma);
        forma.className="formaVrsta";
        forma.innerHTML="*Procenat uspesnosti na takmicenjima";
        // naslov
        /*var h2=document.createElement("h5");
        forma.appendChild(h2);
        h2.innerHTML="*Procenat uspesnosti na takmicenjima";*/
        //div za red
        var red=document.createElement("div");
        red.className="vrsta";
        forma.appendChild(red);
      
        var mini;
     
        for(let i=0;i<ukupanbr;i++)
        {
            mini=document.createElement("div");
            red.appendChild(mini);

            if(i<medalje)
            {
                mini.className="oboji";
                
            }
            else
            {
                mini.className="prazni";
            }
            mini.innerHTML=i+1;
        }

        //prikaz procenta desno 
        let d=document.createElement("div");
        forma.appendChild(d);
        if(ukupanbr==0)
        {
            alert("Ove godine niko nije ucestvovao na takmicenju!");
            d.innerHTML=0+"%";
        }
        else
        {
            d.innerHTML=((medalje/ukupanbr)*100).toFixed(2)+"%";
        }
        
        d.className="br";

    }
    obrisiStatistiku(host)
    {
        if(host==null)
            throw new Exception("ne postoji forma za crtanje!");

        var dete=host.querySelector(".formaStatistika");
        if(dete!=null)
        { host.removeChild(dete);}

        var forma=document.createElement("div");
        forma.className="formaStatistika";
        host.appendChild(forma);

        return forma;
    } 
  
}
