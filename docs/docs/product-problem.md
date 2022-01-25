---
sidebar_position: 1
---

# The Product Problem

The reality of building software products is that it's often very difficult. When starting a new project, developers often underestimate the significant time investment required to even get the development environment working well. With great tools and boilerplates like Create-React-App, you can actually get up and going pretty quickly for some use-cases. 

	npx create-react-app <my-app>

This works for small pet projects, experimentation, and testing, but realistically isn't very helpful when it comes to building out scalable production-ready applications. This is especially true for Full-Stack Applications that require lots of server side logic and database storage.

### A familiar story

You have an idea for a web application that will make life easier for you and many others. 

> "It's so easy. All I have to do is create a dashboard, user profiles, create a few components, set up a few API routes, and it's done!"

You can already envision the end product, your ideal customer, and how you will market the product so you open up your IDE to get started.

> "What's the best technology stack for this app?"
 
Many hours of googling and indecision later, you figure out what you want and run the boilerplate installation script. You run npm start and see the framework display right there. You already have something done!!! So you run git init, make your first commit, and publish it to Github. Now you're ready to get started really building... Or are you? You have to install some libraries, create a bunch of config files, read a bunch of documentation, inevitably ask stack overflow why nothing is working properly. Between linting and typescript rules not doing what you want, and webpack not compiling your SVGs, you're already frustrated and tired. You still have to set up your dev environment with docker to make development easy and platform agnostic. You have to set up testing and write your first tests. You have to deploy and configure cloud servers to house the production and staging environments. You have to build out a CI/CD pipeline. All of this before you have written a single line of business code. Next thing you know it's been days to weeks of "work" and you have nothing to show for it other than a bit of glue and skeleton code. Now all you have to do before you can start building the real features of the application is set up the styling system, create base components, create a login and registration system... I think you can see where this is going. There are weeks worth of configuration work that goes into building the most basic environment, even when you don't have teams of people to consider.

## Selecting a Tech Stack

The truth about the unending search for the best stack is that it is heavily dependant on your use case. Even if you think you know the exact stack to suit your needs, the likelihood is that there are multiple very similar frameworks and tools that you may struggle to choose from. The best stack to choose is generally going to be the one that does the job well enough and gets you up and running in the shortest amount of time (the one you know how to use). Not to mention that no matter which technologies you choose, you have to spend the time to learn and follow standards and best practices. It's really hard to resist the desire to integrate the "new shiny technology", but when creating products in 2021 it's more important than ever to be fast and AGILE.

### Front-End

The scope of work for configuring a scalable front-end is vast and arguably much more intensive than the back-end depending on the type of application.

#### Frameworks

The framework you choose will be mostly dictated by your use case and application requirements as they all have their specific strengths and weaknesses. For example, React and Next render on opposite sides of the stack, leading to different client load times and application capabilities. The most important thing to implement no matter which framework you choose is a systematic scalable project structure. That means predetermining how to structure your directory tree. Doing this well is hard but saves time and money, especially in avoiding the further complication of any refactor work.

#### State Management

Choosing a library for implementing your global state management is an important decision as this will be the layer that houses your business logic on the front end and interacts with external APIs. Getting these systems up and running usually entails a lot of boilerplate code.

#### Styling

Styling methodology is something that should be determined early in the development of any application. It will determine what types of styling files you write and will be VERY time-consuming to refactor later on if you decide to. Styling APIs like styled-system are very popular as they give you the power to build styling with the component mindset you develop in any front-end work. You need to set up global theming and naming patterns very early on as well.

#### Design System

Using a design system library can be a huge time saver when building out a front-end UI. Within the sea of UI libraries, there are both highly opinionated less extensible ones, and those that are very flexible simply providing shortcuts to build out your own components faster. It is valuable to consider exactly what level of customization your design needs. This will dictate which library you choose and therefore how quickly you can build the actual app. Committing to a highly abstracted UI library and later deciding that you need more customization can be a costly mistake requiring extensive refactors.

<img src="https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631466042/perfect-boilerplate/design-system.png" alt="design system screenshot" width="400"/>

#### Documentation

A documentation system is an important part of any team's development process and should be developed alongside features in the product. Going back and adding documentation after-the-fact, is simply too time-consuming as you must read through code and re-learn a system before you can be sure of its exact functionality. Documentation of the Code itself regarding the business logic, and documentation of the design system are of equal importance. Libraries like storybook allow you to create a log of your UI components for reference and develop new ones in isolation. With that, however, comes the price of needing to create another file for each component you wish to document and needing to pipe in mock data to render it.

<img src="https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631466226/perfect-boilerplate/storybook.png" alt="storybook screenshot" width="500"/>

### Back-End

Your back end is responsible for exposing your application's API for consumption with as little latency and high performance as possible.

#### Frameworks

The back end framework you choose will dictate how you structure your application and exactly how API routes are built. Express for example is a simple framework that can get a server up and running in minutes with minimal boilerplate code. Express specifically uses a design pattern called middleware chaining to manipulate data and abstract many server functionalities.

#### Design Pattern

Picking a design pattern is mostly a matter of opinion and use-case but the framework you choose to build the server could enforce some changes to the way you structure the application. There are tons of different design patterns to choose from that are well documented all over the internet. If you want to read a quick summary of some popular node.js patterns check out this article from [Rising Stack](https://blog.risingstack.com/fundamental-node-js-design-patterns/)

#### Documentation

A documentation system is an important part of any team's API development and implementation, especially when it will be consumed externally by paying customers. Companies like stripe have exploded in popularity with the focus on having the best possible documentation. This enhances the experience of everyone involved and can even be cheaper to implement than not. Tools like the swagger editor let developers create API documentation from human readable yaml files very quickly that can even be demo'd by users in the editor.

<img src="https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631466588/perfect-boilerplate/swagger.png" alt="swagger editor" width="500"/>

### Database

Choosing a database is one of the easier choices these days since even noSQL databases like Mongo have extensibility for atomicity, schema validation, and references with the added scalability benefits of sharding. Generally you can use most databases for most application types but it is recommended for projects with known clear schemas to use SQL for the transactional enforcement. Document based noSQL might be the best choice if your schemas may change rapidly such as in a startup environment where you are constantly iterating on the project and its requirements are changing.

<!-- #### Schema

database schema -->

### Automation

The best systems minimize the time developers spend executing tedious repetitive tasks not directly related to the product itself; After all, that's why we use software in the first place. All the way from creating new modules and components to full-stack end-to-end testing there are so many things that developers do that can be automated to a surprising degree. If you don't live under a rock in the web application world you will likely be familiar with many of these technologies and may have worked most of them. These fundamental automations are nearly required in modern development and therefore are usually quite user-friendly. When developers who are familiar with them from tech jobs or from seeing others use them begin implementing them into their own applications, they quickly realize the scope of work involved with the configuration and debugging process for setting up these systems.

No item is trivial on its own not to mention the combined issues of debugging ensuring cooperation between packages, reading documentation, writing config files, and all of the other headaches that come with setting it all up. All of this time just to get a reasonable and flexible environment set up before building anything that the end-user can see. Anyone who has built successful software products knows that this process is not optional. As more people develop on the codebase, the effects of not systematizing and automating the development process compound. Before you know it, your company ends up buried under a mountain of technical debt, inefficiency, and expensive refactors.

#### DEV environment

When working with teams, many developers find that the differences in the machines of each developer (Operating system, installed applications / packages, etc) causes unexpected issues and inconsistencies. This is why many teams opt for containerization of the development environment. This creates a dependency free silo for working on the application that is guaranteed to be consistent across all platforms. One popular solution for this is Docker. Docker allows you to create scripts for building and running container images which can be configured to build and launch a full stack development environment with one command. This requires understanding of linux systems and dockerfile configs to initially create, but once created it can be the saving grace of dev teams.

<!-- #### Testing

Everyone knows testing is a requirement of any modern projects 

#### Linting & Formatting

create config file
install plugins
install configs
exclude directories -->

<!-- #### CI/CD

This is pretty dope dawg -->

## Boilerplates

With all of the complexity introduced above in mind lets talk about some of the ways this can be made easier for developers. We all want to write code that has impact and is tangible in value for the end user. Getting to the point where we can start doing that requires us to minimize time spent setting up the skeleton or integrating frameworks and libraries. For this reason many individuals and organizations publish open source codebase templates for anyone to use. These boilerplates can be found all over forums and blogs linking to github repositories where you can simply run the following command to copy it into your local directory

	git clone <repo-url>

### 