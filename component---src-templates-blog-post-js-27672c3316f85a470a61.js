"use strict";(self.webpackChunkjuheon_dev_blog=self.webpackChunkjuheon_dev_blog||[]).push([[989],{651:function(e,t,n){n.r(t),n.d(t,{Head:function(){return m},default:function(){return u}});var r=n(7294),l=n(1883),a=n(1530),o=n(1345),s=n(9357),c=n(4578);var i=function(e){function t(t){var n;return(n=e.call(this,t)||this).commentsEl=r.createRef(),n.state={status:"pending"},n}(0,c.Z)(t,e);var n=t.prototype;return n.componentDidMount=function(){const e=document.createElement("script");e.onload=()=>this.setState({status:"success"}),e.onerror=()=>this.setState({status:"failed"}),e.async=!0,e.src="https://utteranc.es/client.js",e.setAttribute("repo","hjhj97/blog-comments"),e.setAttribute("issue-term","title"),e.setAttribute("theme","github-light"),e.setAttribute("crossorigin","anonymous"),this.commentsEl.current.appendChild(e)},n.render=function(){const{status:e}=this.state;return r.createElement("div",{className:"comments-wrapper"},"failed"===e&&r.createElement("div",null,"Error. Please try again."),"pending"===e&&r.createElement("div",null,"Loading script..."),r.createElement("div",{ref:this.commentsEl}))},t}(r.Component);const m=e=>{let{data:{markdownRemark:t}}=e;return r.createElement(s.Z,{title:t.frontmatter.title,description:t.frontmatter.description||t.excerpt})};var u=e=>{var t;let{data:{previous:n,next:s,site:c,markdownRemark:m},location:u}=e;const d=(null===(t=c.siteMetadata)||void 0===t?void 0:t.title)||"Title";return r.createElement(o.Z,{location:u,title:d},r.createElement("article",{className:"blog-post",itemScope:!0,itemType:"http://schema.org/Article"},r.createElement("header",null,r.createElement("h1",{itemProp:"headline"},m.frontmatter.title),r.createElement("div",{className:"blog-post-bottom"},r.createElement("p",null,m.frontmatter.date),r.createElement(l.Link,{to:"/?category="+m.frontmatter.category},r.createElement("p",{className:"post-category"},m.frontmatter.category)))),r.createElement("hr",null),r.createElement("section",{dangerouslySetInnerHTML:{__html:m.html},itemProp:"articleBody"}),r.createElement("hr",null),r.createElement("footer",{className:"post-footer"},r.createElement(a.Z,null))),r.createElement("nav",{className:"blog-post-nav"},r.createElement("ul",null,n&&r.createElement("li",null,r.createElement(l.Link,{to:n.fields.slug,rel:"prev"},"← ",n.frontmatter.title)),s&&r.createElement("li",null,r.createElement(l.Link,{to:s.fields.slug,rel:"next"},s.frontmatter.title," →")))),r.createElement(i,null))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-27672c3316f85a470a61.js.map