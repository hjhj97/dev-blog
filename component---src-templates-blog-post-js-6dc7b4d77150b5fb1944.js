"use strict";(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[989],{651:function(e,t,n){n.r(t),n.d(t,{Head:function(){return m},default:function(){return u}});var r=n(7294),l=n(1883),a=n(8771),s=n(8678),i=n(9357),o=n(4578);var c=function(e){function t(t){var n;return(n=e.call(this,t)||this).commentsEl=r.createRef(),n.state={status:"pending"},n}(0,o.Z)(t,e);var n=t.prototype;return n.componentDidMount=function(){const e=document.createElement("script");e.onload=()=>this.setState({status:"success"}),e.onerror=()=>this.setState({status:"failed"}),e.async=!0,e.src="https://utteranc.es/client.js",e.setAttribute("repo","hjhj97/blog-comments"),e.setAttribute("issue-term","title"),e.setAttribute("theme","github-light"),e.setAttribute("crossorigin","anonymous"),this.commentsEl.current.appendChild(e)},n.render=function(){const{status:e}=this.state;return r.createElement("div",{className:"comments-wrapper"},"failed"===e&&r.createElement("div",null,"Error. Please try again."),"pending"===e&&r.createElement("div",null,"Loading script..."),r.createElement("div",{ref:this.commentsEl}))},t}(r.Component);const m=e=>{let{data:{markdownRemark:t}}=e;return r.createElement(i.Z,{title:t.frontmatter.title,description:t.frontmatter.description||t.excerpt})};var u=e=>{var t;let{data:{previous:n,next:i,site:o,markdownRemark:m},location:u}=e;const d=(null===(t=o.siteMetadata)||void 0===t?void 0:t.title)||"Title";return r.createElement(s.Z,{location:u,title:d},r.createElement("article",{className:"blog-post",itemScope:!0,itemType:"http://schema.org/Article"},r.createElement("header",null,r.createElement("h1",{itemProp:"headline"},m.frontmatter.title),r.createElement("p",null,m.frontmatter.date)),r.createElement("section",{dangerouslySetInnerHTML:{__html:m.html},itemProp:"articleBody"}),r.createElement("hr",null),r.createElement("footer",null,r.createElement(a.Z,null))),r.createElement("nav",{className:"blog-post-nav"},r.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},r.createElement("li",null,n&&r.createElement(l.Link,{to:n.fields.slug,rel:"prev"},"← ",n.frontmatter.title)),r.createElement("li",null,i&&r.createElement(l.Link,{to:i.fields.slug,rel:"next"},i.frontmatter.title," →")))),r.createElement(c,null))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-6dc7b4d77150b5fb1944.js.map