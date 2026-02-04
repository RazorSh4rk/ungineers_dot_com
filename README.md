# Ungineers website

Assorted list of projects by the ungineers crew

## stack

- react
- shadcn
  - dark mode only
- phosphoricons
- react-markdown
  - remark-gfm
  - remark-breaks

## about us page

- display this with a discord icon [discord invite](https://discord.com/invite/MBcHGUv2CB)
- separate page
- i will write the text later, for now just put the link there 
- display uni_cube_v0.webp
- display this link under [calicube](https://www.printables.com/model/634840-ungineers-calicube)
- centered

## projects

- projects are a collection of links to markdown files
  - alternatively links to external sites to load
  - check the json definition for explanation
- every project has multiple pages
- each page is a link to raw markdown the page then loads into its body

## images

- if image is absolute link, keep it
  - raw.githubusercontent...
  - external site
- if image is in context of repo, rewrite it to be a raw github link
  - ./folder/image.png
  - image.png

## links

- similarly to images
  - automagically rewrite the link to include github.com/...

## json structure

- projects[] : exhaustive list of projects to display in menu
  - name: what to display in menu
  - description?: visible on hover
  - repo: link to git or other website
    - clicking just the project title navigates here in a new tab
  - author: used for grouping
  - pages[] : list of pages to put under the project in the menu
    - title: what to display in menu
    - url: where to fetch the content to load in the website from
      - this is not a redirect url!
    - icon?: phosphoricon selector
    - embed?: if true, display a borderless iframe with the source as the given url instead
    - pdf?: if true, load the provided url into a pdf reader in the body

### icons

- every menu item can have an icon
- they are limited to https://phosphoricons.com
- if the key is empty, default to arrow-fat-right
- their name will be just the name without the ph-
  - for example arrow-fat-right instead of ph-arrow-fat-right
