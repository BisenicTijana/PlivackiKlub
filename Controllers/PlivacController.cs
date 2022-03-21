using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;

namespace PROJEKAT.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlivacController : ControllerBase
    {
        public PlivackiKlubContext Context { get; set; }
        public PlivacController(PlivackiKlubContext context)
        {
            Context = context;
        }


        [Route("DodajPlivaca/{id}/{jmbg}/{ime}/{prezime}/{datrodj}/{kontakt}/{pol}/{nivospreme}")]
        [HttpPost]
        public async Task<ActionResult> DodajPlivaca(int id,string jmbg,string ime,string prezime,DateTime datrodj,string kontakt,char pol,string nivospreme) //ok 
        {
            if(id<0)
            {
                return BadRequest("Nevalidan ID Kluba!//dodaj plivaca");
            }
            if(string.IsNullOrWhiteSpace(jmbg) || jmbg.Length!=13)
            {
                return BadRequest("Pogresan JMBG!");
            }

            if(string.IsNullOrWhiteSpace(ime) || ime.Length>50)
            {
                return BadRequest("Pogresno Ime!");
            }

            if(string.IsNullOrWhiteSpace(prezime) || prezime.Length>50)
            {
                return BadRequest("Pogresno Prezime!");
            }

            if((string.IsNullOrWhiteSpace(nivospreme) || nivospreme.Length>20) || (nivospreme!="takmicar" && nivospreme!="neplivac" && nivospreme!="rekreativac") )
            {
                return BadRequest("Pogresan Nivo Spreme!");
            }

            if(pol.CompareTo('Z')!=0 && pol.CompareTo('M')!=0)
            {
                return BadRequest("Pogresan Pol");
            }
            if(string.IsNullOrWhiteSpace(kontakt) || kontakt.Length>35)
            {
                return BadRequest("Pogresan Kontakt!");
            }
            try
            {
                ime=ime.ToLower();
                prezime=prezime.ToLower();
                kontakt=kontakt.ToLower();
                nivospreme=nivospreme.ToLower();

                var klub=Context.Klubovi.Where(p=>p.ID==id).FirstOrDefault();//da li postoji taj klub
                if(klub==null)
                    return BadRequest("Nema Kluba");
             
                var ima=Context.Plivaci.Include(p=>p.Klub).Where(p=>p.JMBG==jmbg).FirstOrDefault();//da li vec postoji taj plivac
                if(ima!=null)//ima ga u bazi
                {
                    if(ima.Klub.ID==id)//u ovom je klubu
                    {
                        return BadRequest("Plivac je vec upisan u ovaj klub!");
                    }
                    else 
                    {
                        return BadRequest("Plivac je vec clan kluba "+ima.Klub.Ime+"!");
                    }
                }

                //nema ga 
                var plivac=new Plivac();
                plivac.JMBG=jmbg;
                plivac.Ime=ime;
                plivac.Prezime=prezime;;
                plivac.DatumRodjenja=datrodj;
                plivac.Pol=pol;
                plivac.NivoSpreme=nivospreme;
                plivac.Kontakt=kontakt;
                plivac.Klub=klub;

                Context.Plivaci.Add(plivac);
                await Context.SaveChangesAsync();
                //return Ok(plivac);
                return Ok(await Context.Plivaci.Where(p=>p.JMBG==jmbg).Select(p=> 
                new {
                                ID=p.ID,
                                JMBG=p.JMBG,
                                Ime=p.Ime,
                                Prezime=p.Prezime,
                                Pol=p.Pol,
                                NivoSpreme=p.NivoSpreme,
                                DatumRodjenja=p.DatumRodjenja,
                                Kontakt=p.Kontakt,
                                PlivacNaTakmicenjima=p.PlivacNaTakmicenjima.Select(q=>
                                new
                                {
                                    Godina=q.Takmicenje.Datum.Year,
                                    Plasman=q.Plasman
                                })
                    
                   
                }).ToListAsync());
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }
        
        [Route("UcitajPlivaca")]
        [HttpGet]
        public async Task<ActionResult> UcitajPlivaca(int idKlub,string x=null, string y=null)//ok
        {
            
            if(idKlub<0)
            {
                return BadRequest("nevalidan id kluba");
            }
            if(x==null && y==null)
            {
                return BadRequest("Morate uneti ime ili prezime za pretragu!");
            }
           try
           { 
               if(x!=null && y!=null)//uneta oba
               {
                   if(x!=null)
                   {x=x.ToLower();}
                   else 
                   { y=y.ToLower();}   

                   var plivaci=Context.Plivaci.Where(p=>p.Klub.ID==idKlub && (( p.Ime==x && p.Prezime==y) || (p.Ime==y && p.Prezime==x)));
                   if(plivaci.Count()!=0)
                        return Ok( await plivaci.OrderBy(p=>p.NivoSpreme).ToListAsync());
                    else
                    {
                        return BadRequest("Ne postoji plivac "+x+" "+y);
                    }
               }
               else if(x!=null || y!=null)//poslato ime ili prezime
               {
                   string z;
                   if(x!=null)
                   {z=x.ToLower();}
                   else 
                   { z=y.ToLower();}    

                   var plivaci=Context.Plivaci.Where(p=> p.Klub.ID==idKlub && (p.Ime==z || p.Prezime==z));
                   if(plivaci.Count()!=0)
                        return Ok( await plivaci.OrderBy(p=>p.NivoSpreme).ToListAsync());
                    else
                    {
                        return BadRequest("Ne postoji plivac "+z);
                    }
               }
               else
               {
                   return BadRequest("Ne postoji taj plivac u ovom klubu!");
               }
               
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [Route("PromeniPlivaca/{idKlub}/{jmbg}/{ime}/{prezime}/{kontakt}/{nivospreme}")] //ok
        [HttpPut]

        public async Task<ActionResult> PromeniPlivaca(int idKlub, string jmbg, string ime, string prezime, string kontakt,string nivospreme)//ok
        {
            if(idKlub<0)
            {
                return BadRequest("nevalidan id kluba");
            }
            
            if(string.IsNullOrWhiteSpace(jmbg) || jmbg.Length!=13)
            {
                return BadRequest("Pogresan JMBG!");
            }
            if(string.IsNullOrWhiteSpace(ime) || ime.Length>50)
            {
                return BadRequest("Pogresno Ime!");
            }

            if(string.IsNullOrWhiteSpace(prezime) || prezime.Length>50)
            {
                return BadRequest("Pogresno Prezime!");
            }
            if((string.IsNullOrWhiteSpace(nivospreme) || nivospreme.Length>20) || (nivospreme!="takmicar" && nivospreme!="neplivac" && nivospreme!="rekreativac") )
            {
                return BadRequest("Pogresan nivo spreme!");
            }

            if(string.IsNullOrWhiteSpace(kontakt) || kontakt.Length>35)
            {
                return BadRequest("Pogresan kontakt!");
            }

            try
            {
                ime=ime.ToLower();
                prezime=prezime.ToLower();
                kontakt=kontakt.ToLower();
                nivospreme=nivospreme.ToLower();
                var klub=Context.Klubovi.Where(p=>p.ID==idKlub).FirstOrDefault();
                if(klub==null)
                {
                    return BadRequest("Ne postoji ovaj klub!");
                }
                var plivac=Context.Plivaci.Where(p => p.JMBG == jmbg && p.Klub.ID==idKlub).FirstOrDefault();//nadjemo plivaca za izmenu

                if(plivac!= null)
                {
                    
                    //ako je promenjen nivo spreme onda treba da ga obrisem iz spoja ako je bio takmicar
                    if(plivac.NivoSpreme=="takmicar" && nivospreme!="takmicar")//ako je bio takmicar, ali sada vise nije
                    { 
                       var spoj=Context.Ucestvuje.Include(p=>p.Plivac).Where(p=>p.Plivac.JMBG==jmbg).ToList();
                        if(spoj!=null)//ako uopste ima rezultate 
                        {
                            foreach(var el in spoj)
                                {
                                    Context.Ucestvuje.Remove(el);
                                }

                        }
                    }
                    //provera da li hoce iz rekr ili takm u neplivace
                    if(plivac.NivoSpreme!="neplivac" && nivospreme=="neplivac")
                    {
                        return BadRequest(plivac.NivoSpreme+" ne moze postati neplivac!");
                    }
                    //promena
                    plivac.Ime=ime;
                    plivac.Prezime=prezime;
                    plivac.NivoSpreme=nivospreme;
                    plivac.Kontakt=kontakt;

                    await Context.SaveChangesAsync();   
                  
                    return Ok(await Context.Plivaci.Where(p=>p.JMBG==jmbg).Select(p=> 
                            new 
                            {
                                ID=p.ID,
                                JMBG=p.JMBG,
                                Ime=p.Ime,
                                Prezime=p.Prezime,
                                Pol=p.Pol,
                                NivoSpreme=p.NivoSpreme,
                                DatumRodjenja=p.DatumRodjenja,
                                Kontakt=p.Kontakt,
                                PlivacNaTakmicenjima=p.PlivacNaTakmicenjima.Select(q=>
                                new
                                {
                                    Godina=q.Takmicenje.Datum.Year,
                                    Plasman=q.Plasman
                                })
                            }).ToListAsync());               
                }
                else
                {
                    return BadRequest("Plivac nije pronadjen!");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

     

        [Route("ObrisiPlivaca/{idKluba}/{jmbg}")]
        [HttpDelete]

         public async Task<ActionResult> ObrisiPlivaca(int idKluba,string jmbg)//ok
        {
    
            if(string.IsNullOrWhiteSpace(jmbg) || jmbg.Length!=13)
            {
                return BadRequest("Pogresan JMBG!");
            }
            if(idKluba<0)
            {
                return BadRequest("Nevalidan id kluba!");
            }
            try
            {
                var plivac=Context.Plivaci.Where(p => p.JMBG == jmbg && p.Klub.ID==idKluba).FirstOrDefault();

                //PROVERA DA LI TAKAV PLIVAC POSTOJI!!!!!!!!!!
                if(plivac==null)
                {
                    return BadRequest("Plivac nije clan ovog kluba!");
                }
                var spoj=Context.Ucestvuje.Include(p=>p.Plivac).Where(p => p.Plivac.JMBG == jmbg).ToList();//vrati sve njegove vrste iz spoja
                if(spoj!=null)
                {
                    foreach(var el in spoj)
                        {
                            Context.Ucestvuje.Remove(el);
                        }
                }
                Context.Plivaci.Remove(plivac);
                await Context.SaveChangesAsync();

                return Ok("Uspesno ispisan plivac iz kluba!");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
      
       [Route("DodajRezultat/{idKluba}/{jmbg}/{idDisciplina}/{idTakm}/{plasman}/{vreme}")]
       [HttpPost]
       public async Task<ActionResult> DodajRezultat(int idKluba,string jmbg, int idDisciplina,int idTakm,int plasman, TimeSpan vreme )//ok
       {      
            if(idKluba<0)
            {
                return BadRequest("Nevalidan id kluba!");
            }                                                                                          
            if(string.IsNullOrWhiteSpace(jmbg) || jmbg.Length!=13)
            {
                return BadRequest("Pogresan JMBG!");
            }
            if(idDisciplina<0)
            {
                return BadRequest("Nevalidan id discipline!");
            }
            if(idTakm<0)
            {
                return BadRequest("Nevalidan id takmicenja!");
            }
            if( plasman<=0)
            {
                return BadRequest("Nevalidna vrednost plasmana!");
            }
            try
            {
                var klub=Context.Klubovi.Where(p=>p.ID==idKluba).FirstOrDefault();
                if(klub==null)
                {
                    return BadRequest("Ne postoji ovaj klub");
                }
                
                var plivac=Context.Plivaci
                                .Include(p=>p.PlivacNaTakmicenjima).Where(p=>p.JMBG==jmbg && p.Klub.ID==idKluba).FirstOrDefault();
                if(plivac==null)
                {
                    return BadRequest("Ovaj plivac nije clan kluba "+klub.Ime+"!");
                }
    
                var takmSve=await Context.Takmicenja.Where(p=>p.ID==idTakm).FirstOrDefaultAsync();//nadji takm

                if(takmSve==null)
                {
                    return BadRequest("Nema takmicenja u bazi! Dodaj ga!");
                }

                var disciplina=Context.Discipline.Where(p=>p.ID==idDisciplina).FirstOrDefault();

                if(disciplina==null)
                {
                    return BadRequest("Nema discipline u bazi!");
                }
                 
                 //provera da li se ovaj rez vec nalazi u bazi============plivac,takm,disc

                var ima=Context.Ucestvuje
                                .Include(p=>p.Plivac)
                                .Include(p=>p.Takmicenje)
                                .Include(p=>p.Disciplina)
                                .Where(p=>p.Plivac.JMBG==jmbg && p.Disciplina.ID==idDisciplina && p.Takmicenje.ID==idTakm).FirstOrDefault();
                if(ima!=null)
                {
                    return BadRequest("Vec je upisan ovaj rezultat!");
                }

                //sve je ok i nema rez, dodaj
                var rez=new Ucestvuje();
                rez.Plivac=plivac;
                rez.Takmicenje=takmSve;
                rez.Disciplina=disciplina;
                rez.Plasman=plasman;
                rez.Rezultat=vreme;
                Context.Ucestvuje.Add(rez);
                await Context.SaveChangesAsync();


            var novirez=Context.Ucestvuje.
            Include(p=>p.Takmicenje)
            .Include(p=>p.Plivac)
            .Include(p=>p.Disciplina)
            .Where(p=>p.Plivac==plivac && p.Takmicenje==takmSve
            && p.Disciplina==disciplina && p.Plasman==plasman && p.Rezultat==vreme);
            
            return Ok(await novirez.Select(p=> 
                            new 
                            {   Distanca=p.Disciplina.Distanca,
                                Stil=p.Disciplina.Stil,
                                Rezultat=p.Rezultat.Hours.ToString()+":"+p.Rezultat.Minutes.ToString()+"."+p.Rezultat.Seconds.ToString(),
                                Grad=p.Takmicenje.Grad,
                                Drzava=p.Takmicenje.Drzava,
                                Plasman=p.Plasman,
                                Godina=p.Takmicenje.Datum.Year
                            }).ToListAsync());
            
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

       }
      
       [Route("NajboljiRezultat/{idKluba}/{jmbg}/{idDisciplina}/{izbor}")]
       [HttpGet]
       public async Task<ActionResult> NajboljiRezultatPlivaca(int idKluba, string jmbg, int idDisciplina, int izbor)//ok
       {
           if(idKluba<0)
            {
                return BadRequest("Nevalidan id kluba!");
            }  
           if(string.IsNullOrWhiteSpace(jmbg) || jmbg.Length!=13)
            {
                return BadRequest("Pogresan JMBG!");
            }

            if(idDisciplina<0)
            {
                return BadRequest("Nevalidan id");
            }
            if(izbor!=0 && izbor!=1) //0-vreme 1-plasman
            {
                return BadRequest("Ne postoji ova opcija za izbor!");
            }

            try
            {
                var klub=Context.Klubovi.Where(p=>p.ID==idKluba).FirstOrDefault();
                if(klub==null)
                {
                    return BadRequest("Ne postoji klub!");
                }
                var plivac=Context.Plivaci.Where(p=>p.JMBG==jmbg && p.Klub.ID==idKluba);
                if(plivac==null)
                {
                    return BadRequest("Plivac nije clan ovog kluba!");
                }
                var rezultati=Context.Ucestvuje
                            .Include(p=>p.Plivac)
                            .Include(p=>p.Disciplina)
                            .Include(p=>p.Takmicenje)
                            .Where(p=>p.Plivac.JMBG==jmbg && p.Disciplina.ID==idDisciplina);//nadjemo u tabeli plivaca i svaki put kad je plivao tu disciplinu
                
                if(rezultati.Count()==0)
                    return BadRequest("Plivac nikada nije plivao ovu disciplinu na takmicenju!");
                
                if(izbor==0)//najbolje vreme
                {
                    rezultati=rezultati.OrderBy(p=>p.Rezultat);
                    var best=rezultati.First();// uzmemo najbolji
                
                    rezultati=rezultati.Where(p=>p.Rezultat==best.Rezultat);//vratimo sve sa istim rez
                    rezultati=rezultati.OrderBy(p=>p.Plasman);//i na kraju te sa istim rez sortiramo po plasmanu
                }
                else//najbolji plasman
                {
                   rezultati=rezultati.OrderBy(p=>p.Plasman);
                   var best=rezultati.First();// uzmemo najbolji
                
                   rezultati=rezultati.Where(p=>p.Plasman==best.Plasman);
                   rezultati=rezultati.OrderBy(p=>p.Rezultat);
                }
             

               var plivaci= await rezultati.ToListAsync();
               
                return Ok
                (
                    plivaci.Select(p=>
                    new
                    {
                        Datum=p.Takmicenje.Datum, 
                        Disciplina=p.Disciplina.ID,
                        //Rezultat=p.Rezultat.Minutes+":"+p.Rezultat.Seconds+"."+p.Rezultat.Milliseconds,
                        Rezultat=p.Rezultat.Hours+":"+p.Rezultat.Minutes+"."+p.Rezultat.Seconds,
                        Plasman=p.Plasman
                    }).ToList()
                );
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
       }
      
      //----------------------------------------------NE KORISTIM------------------------------------------//
      
        [Route("PreuzmiPlivace")]
        [HttpGet]
        public async Task<ActionResult> PrikaziSvePlivace()//ok,ne koristim
        {
            return Ok(await Context.Plivaci
                                    .Include(p=>p.Klub).ToListAsync());
        }
        
     
      
    }
}
