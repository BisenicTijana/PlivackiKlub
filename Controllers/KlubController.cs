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
    public class KlubController : ControllerBase
    {
        public PlivackiKlubContext Context { get; set; }
        public KlubController(PlivackiKlubContext context)
        {
            Context = context;
        }


        [Route("PreuzmiSveKlubove")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiSveKlubove()//ok
        {
            try
            {
                var klubovi=Context.Klubovi
                        .Include(k=>k.ListaPlivaca);
                        
                if(klubovi.Count()==0)
                {
                    return BadRequest("nema klubova u bazi!");
                }
                return Ok(await Context.Klubovi.Select(p=>
                    new
                    {
                        ID=p.ID,
                        Ime=p.Ime,
                        Adresa=p.Adresa,
                        Telefon=p.BrTelefona,
                        Email=p.Email,
                    }).ToListAsync());
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }

        [Route("PromeniKlub/{id}/{tel}/{email}")]
        [HttpPut]
        public async Task<ActionResult> PromeniKlub(int id,string tel, string email)//ok
        {
            if(id<0)
            {
                return BadRequest("Nevalidan id kluba");
            }
            if(string.IsNullOrWhiteSpace(tel) || tel.Length>15)
            {
                return BadRequest("Pogresan broj telefona");
            }
            if(string.IsNullOrWhiteSpace(email) || email.Length>30)
            {
                return BadRequest("Pogresan email");
            }
            if(tel=="" && email=="")
            {
                return BadRequest("Morate da popunite bar jedno polje kako bi azurirali podatke!");
            }
            try
            {
                var klub=Context.Klubovi.Where(p=>p.ID==id).FirstOrDefault();
                if(klub==null)
                {
                    return BadRequest("Ovaj klub ne postoji u bazi!!!");
                }
               
                klub.BrTelefona=tel;
              
                klub.Email=email;
                  
              
                await Context.SaveChangesAsync();

                return Ok(klub);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PreuzmiSvePlivace/{idKluba}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiSvePlivace(int idKluba)//ok
        {
            if(idKluba<0)
            {
                return BadRequest("Nevalidan id kluba!");
            }
            try
            {
                var plivaci=Context.Plivaci.Include(p=>p.PlivacNaTakmicenjima)
                                            .ThenInclude(p=>p.Takmicenje).Where(p=>p.Klub.ID==idKluba);
                if(plivaci.Count()==0) //!!!
                {
                    return BadRequest("Ovaj klub nema plivace!");
                }

                return Ok(await plivaci.Select(p=>
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
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }
       
       //-------------------------NISAM KORISTILA-----------------------------
       
       
       
        [Route("PreuzmiKlub/{id}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiKlub(int id) //ok, ne koristim
        {
            if(id<0)
            {
                return BadRequest("Nevalidan id kluba!");
            }
            try
            {
                var klub=Context.Klubovi
                        .Include(k=>k.ListaPlivaca)
                        /*.Include(k=>k.ListaTakmicenja)*/.Where(k=>k.ID==id).FirstOrDefault(); //nadji klub
                var plivaci=klub.ListaPlivaca.Count();//br plivaca
                var takmicari=klub.ListaPlivaca.Where(p=>p.NivoSpreme=="takmicar").Count();//ovde nista ne bi trebalo da baca null exc
                var neplivaci=klub.ListaPlivaca.Where(p=>p.NivoSpreme=="neplivac").Count();
                var rekreativci=klub.ListaPlivaca.Where(p=>p.NivoSpreme=="rekreativac").Count();

                if(klub==null) 
                {
                    return BadRequest("Ne postoji taj klub u bazi!");
                }

                return Ok(await Context.Klubovi.Where(p=>p.ID==id).Select(p=>
                new
                {
                    Ime=p.Ime,
                    Adresa=p.Adresa,
                    Telefon=p.BrTelefona,
                    Email=p.Email,
                    br=plivaci,
                    brtakm=takmicari,
                    brnepl=neplivaci,
                    brrekr=rekreativci
                }).ToListAsync());
                   
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }

       

        [Route("DodajKlub")]
        [HttpPost]
        public async Task<ActionResult> DodajKlub([FromBody] Klub klub) //ok, ne koristim
        {
            if(string.IsNullOrWhiteSpace(klub.Ime) || klub.Ime.Length>50)
            {
                return BadRequest("Pogresno Ime!");
            }

            if(string.IsNullOrWhiteSpace(klub.Adresa) || klub.Adresa.Length>50)
            {
                return BadRequest("Pogresna Adresa!");
            }

            try
            {
                Context.Klubovi.Add(klub);
                await Context.SaveChangesAsync();
                return Ok($"Klub je dodat! ID: {klub.ID}");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }

        [Route("ObrisiKlub/{id}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiKlub(int id)//ok, ne koristim
        {
            if(id<0)
            {
                return BadRequest("Los id!");
            }
            try
            {
                var klub= await Context.Klubovi.FindAsync(id);
                if(klub == null)
                    return BadRequest("Ne postoji klub sa tim identifikatorom!");
                string naziv= klub.Ime;
                Context.Klubovi.Remove(klub);
                await Context.SaveChangesAsync();
                return Ok("Obrisan je klub: "+naziv);

            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }

        }
     
    }
}
