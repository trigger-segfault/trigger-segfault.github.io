---
# Required for /assets/js/search.js
# Not in-use at the moment
published: false
permalink: /content.json
---
{
  {%- for entry in site.posts -%}
    "{{ entry.url | slugify }}": {
        "title": "{{ entry.title | xml_escape }}",
        "url": "{{ entry.url | xml_escape }}",
        "tags": "{{ entry.tags }}",
        "summary": "{{ entry.excerpt | escape }}"
    },
  {%- endfor -%}
  {%- for entry in site.pages -%}
    "{{ entry.url | slugify }}": {
        "title": "{{ entry.title | xml_escape }}",
        "url": "{{ entry.url | xml_escape }}",
        "tags": ["{{ entry.tags | join: '", "' }}"],
        "summary": "{{ entry.excerpt | escape }}"
    }
    {%- unless forloop.last -%},{%- endunless -%}
  {%- endfor -%}
}