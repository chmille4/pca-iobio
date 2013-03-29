window.region = {
   ASW : 'AFR',
   LWK : 'AFR',
   YRI : 'AFR',
   CLM : 'AMR',
   MXL : 'AMR',
   PUR : 'AMR',
   CHB : 'ASN',
   CHS : 'ASN',   
   JPT : 'ASN',
   CEU : 'EUR',
   FIN : 'EUR',   
   GBR : 'EUR',
   IBS : 'EUR',
   TSI : 'EUR'
}

window.region_hierachy = [
   {  
      name     : 'AFR',
      children : ['ASW', 'LWK', 'YRI'] 
   },
   {  
      name     : 'ASN',
      children : ['CHB','CHS','JPT']
   },
   { 
      name     : 'AMR',
      children : ['CLR', 'MXL', 'PUR']
   },
   { 
      name     : 'EUR',
      children : ['CEU', 'FIN', 'GBR', 'IBS', 'TSI'] 
   }
]         