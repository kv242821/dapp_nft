import{s as C,r as a,t as p,A as w,v as W,aC as f,x as v,y as T,z as y,F as S,J as b,K as A,H as E,L as N,M as R,aD as k,aB as d,aE as F,aF as M,N as U,B as o,an as m,O as _,P as x,T as I,Q as L}from"./index-20076c51.js";import{S as B}from"./erc-721-standard-61683796.browser.esm-46cdfc26.js";import{P as O}from"./thirdweb-checkout-4effb855.browser.esm-22108e1c.js";class l extends B{constructor(t,r,e){let n=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},i=arguments.length>4?arguments[4]:void 0,h=arguments.length>5?arguments[5]:void 0,u=arguments.length>6&&arguments[6]!==void 0?arguments[6]:new C(t,r,i,n);super(u,e,h),a(this,"abi",void 0),a(this,"owner",void 0),a(this,"encoder",void 0),a(this,"estimator",void 0),a(this,"metadata",void 0),a(this,"app",void 0),a(this,"sales",void 0),a(this,"platformFees",void 0),a(this,"events",void 0),a(this,"roles",void 0),a(this,"interceptor",void 0),a(this,"royalties",void 0),a(this,"claimConditions",void 0),a(this,"revealer",void 0),a(this,"signature",void 0),a(this,"checkout",void 0),a(this,"createBatch",p(async(s,c)=>this.erc721.lazyMint.prepare(s,c))),a(this,"claimTo",p(async(s,c,g)=>this.erc721.claimTo.prepare(s,c,g))),a(this,"claim",p(async(s,c)=>this.erc721.claim.prepare(s,c))),a(this,"burn",p(async s=>this.erc721.burn.prepare(s))),this.abi=w.parse(i||[]),this.metadata=new W(this.contractWrapper,f,this.storage),this.app=new v(this.contractWrapper,this.metadata,this.storage),this.roles=new T(this.contractWrapper,l.contractRoles),this.royalties=new y(this.contractWrapper,this.metadata),this.sales=new S(this.contractWrapper),this.encoder=new b(this.contractWrapper),this.estimator=new A(this.contractWrapper),this.events=new E(this.contractWrapper),this.platformFees=new N(this.contractWrapper),this.interceptor=new R(this.contractWrapper),this.claimConditions=new k(this.contractWrapper,this.metadata,this.storage),this.signature=new d(this.contractWrapper,this.storage),this.revealer=new F(this.contractWrapper,this.storage,M.name,()=>this.erc721.nextTokenIdToMint()),this.signature=new d(this.contractWrapper,this.storage),this.owner=new U(this.contractWrapper),this.checkout=new O(this.contractWrapper)}onNetworkUpdated(t){this.contractWrapper.updateSignerOrProvider(t)}getAddress(){return this.contractWrapper.readContract.address}async totalSupply(){const t=await this.totalClaimedSupply(),r=await this.totalUnclaimedSupply();return t.add(r)}async getAllClaimed(t){const r=o.from((t==null?void 0:t.start)||0).toNumber(),e=o.from((t==null?void 0:t.count)||m).toNumber(),n=Math.min((await this.totalClaimedSupply()).toNumber(),r+e);return await Promise.all(Array.from(Array(n).keys()).map(i=>this.get(i.toString())))}async getAllUnclaimed(t){const r=o.from((t==null?void 0:t.start)||0).toNumber(),e=o.from((t==null?void 0:t.count)||m).toNumber(),n=o.from(Math.max((await this.totalClaimedSupply()).toNumber(),r)),i=o.from(Math.min((await this.contractWrapper.readContract.nextTokenIdToMint()).toNumber(),n.toNumber()+e));return await Promise.all(Array.from(Array(i.sub(n).toNumber()).keys()).map(h=>this.erc721.getTokenMetadata(n.add(h).toString())))}async totalClaimedSupply(){return this.erc721.totalClaimedSupply()}async totalUnclaimedSupply(){return this.erc721.totalUnclaimedSupply()}async isTransferRestricted(){return!await this.contractWrapper.readContract.hasRole(_("transfer"),x)}async getClaimTransaction(t,r,e){return this.erc721.getClaimTransaction(t,r,e)}async prepare(t,r,e){return I.fromContractWrapper({contractWrapper:this.contractWrapper,method:t,args:r,overrides:e})}async call(t,r,e){return this.contractWrapper.call(t,r,e)}}a(l,"contractRoles",L);export{l as SignatureDrop};
