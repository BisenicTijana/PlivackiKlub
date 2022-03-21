

export class Rezultat
{
   constructor( datum, distanca,stil,rezultat,plasman)
   {
      // this.id=id;
       this.datum=datum;
       this.distanca=distanca;
       this.stil=stil;
       this.rezultat=rezultat;
       this.plasman=plasman;
   }

   crtajTabeluPod(host)
   {
       //ovde dodaj i crtanje podataka
        var tr=document.createElement("tr");
        host.appendChild(tr);

        var el=document.createElement("td");
        let dat=new Date(this.datum);
        let xs=dat.toLocaleDateString('sv-SE');
        el.innerHTML=xs;
        tr.appendChild(el);

        var el=document.createElement("td");
        el.innerHTML=this.distanca+" "+this.stil;//disc
        tr.appendChild(el);

        var el=document.createElement("td");
        el.innerHTML=this.rezultat;
        tr.appendChild(el);

        var el=document.createElement("td");
        el.innerHTML=this.plasman;
        tr.appendChild(el);

   }

}