"use strict";(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[989],{651:function(e,t,r){r.r(t),r.d(t,{Head:function(){return m},default:function(){return u}});var n=r(7294),a=r(1883),l=r(8771),s=r(1345),o=r(9357),c=r(4578);var i=function(e){function t(t){var r;return(r=e.call(this,t)||this).commentsEl=n.createRef(),r.state={status:"pending"},r}(0,c.Z)(t,e);var r=t.prototype;return r.componentDidMount=function(){const e=document.createElement("script");e.onload=()=>this.setState({status:"success"}),e.onerror=()=>this.setState({status:"failed"}),e.async=!0,e.src="https://utteranc.es/client.js",e.setAttribute("repo","hjhj97/blog-comments"),e.setAttribute("issue-term","title"),e.setAttribute("theme","github-light"),e.setAttribute("crossorigin","anonymous"),this.commentsEl.current.appendChild(e)},r.render=function(){const{status:e}=this.state;return n.createElement("div",{className:"comments-wrapper"},"failed"===e&&n.createElement("div",null,"Error. Please try again."),"pending"===e&&n.createElement("div",null,"Loading script..."),n.createElement("div",{ref:this.commentsEl}))},t}(n.Component);const m=e=>{let{data:{markdownRemark:t}}=e;return n.createElement(o.Z,{title:t.frontmatter.title,description:t.frontmatter.description||t.excerpt})};var u=e=>{var t;let{data:{previous:r,next:o,site:c,markdownRemark:m},location:u}=e;const d=(null===(t=c.siteMetadata)||void 0===t?void 0:t.title)||"Title";return n.createElement(s.Z,{location:u,title:d},n.createElement("article",{className:"blog-post",itemScope:!0,itemType:"http://schema.org/Article"},n.createElement("header",null,n.createElement("h1",{itemProp:"headline"},m.frontmatter.title),n.createElement("div",{className:"blog-post-bottom"},n.createElement("p",null,m.frontmatter.date),n.createElement(a.Link,{to:"/?category="+m.frontmatter.category},n.createElement("p",{className:"post-category"},m.frontmatter.category)))),n.createElement("hr",null),n.createElement("section",{dangerouslySetInnerHTML:{__html:m.html},itemProp:"articleBody"}),n.createElement("hr",null),n.createElement("footer",{className:"post-footer"},n.createElement(l.Z,null))),n.createElement("nav",{className:"blog-post-nav"},n.createElement("ul",null,r&&n.createElement("li",null,n.createElement(a.Link,{to:r.fields.slug,rel:"prev"},"← ",r.frontmatter.title)),o&&n.createElement("li",null,n.createElement(a.Link,{to:o.fields.slug,rel:"next"},o.frontmatter.title," →")))),n.createElement(i,null))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-db9247894c9bb841a419.js.map