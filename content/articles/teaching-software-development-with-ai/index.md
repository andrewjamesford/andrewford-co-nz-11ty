---
title: Teaching Software Development with AI
date: "2023-06-07T08:09:00Z"
template: post
draft: false
slug: "teaching-software-development-with-ai"
category: article
tags:
  - chatgpt
  - copilot
  - codespaces
  - education
  - innovation
  - machine learning
  - environmental sustainability
description: This educational innovation plan focuses on leveraging technology to enhance remote education practices by implementing AI tools to assist learners in their learning journey.
ogimage: "vscode-copilot.png"
---

How do you innovate in education when the school you teach at is already a remote school underpinned by technology and couldn't operate without it? Every class meeting is online, with the likes of [Zoom](https://zoom.us) or [Google Meet](https://meet.google.com). Communication between staff and students is via [Slack](https://slack.com) instant messaging. Course exercises, projects and learning materials are all delivered via our web-based LMS (Learner Management System) [iQualify](https://www.iqualify.com) (in the form of videos, tutorials, exercises and quizzes).

You lean into technology is how. Every week new tools are released that you can incorporate into your education practices. We have seen the most significant growth in Machine Learning technology with the increase in the ability of Large Language Models at an almost frightening pace. Since late last year, we have seen huge jumps in the capability of generative AI art models to produce fantastic images from simple text prompts. We have seen all the GPT (Generative pre-trained transformer) tools like [ChatGPT](https://openai.com/product/chatgpt), for example, that given short text prompts can produce answers for simple facts to writing history essays. What’s even more exciting is the adoption of the technology companies adding these capabilities to products we already use and love. AI answers have now been incorporated into searches on [Bing](https://www.bing.com/new) and [Google](https://www.google.co.nz), so your answers are provided directly in the search engine itself. [Adobe](https://www.adobe.com) has added generative image creation into Photoshop to create extraordinary images with text prompts. [Canva](https://www.canva.com) can produce multiple templates on the fly from a user uploading an image and some colour prompts.

We have benefitted significantly at [Developers Institute](https://www.developers.ac.nz) by integrating digital learning into our practices. What was once an in-person school in Whangarei teaching Software Development in a class environment. We now teach students from all over the motu in Aotearoa to even some overseas online by embracing digital technology in our teaching practices. But there are still more tools we can embrace to benefit the learners.

One of these ways is to incorporate ChatGPT as another tool for our students to get support in their learning, exercises and projects. With ChatGPT, there can always be help available to answer questions at any time. ChatGPT was trained on a large portion of code on [GitHub](https://github.com), the collaborative version control software that hosts an extensive collection of open-source projects. Because of this, it can answer most questions about code syntax and provide examples for learners. Say a learner wanted to know how to fetch some data in a format called JSON (JavaScript Object Notation) using the JavaScript programming language. They could ask this to ChatGPT, which would explain with an example code like in the screenshot below. The answer has a step-by-step breakdown of what needs to happen, an example snippet of code and a summary explaining how it works.

{% figure "./js-fetch-chatgpt.png", "ChatGPT fetch example" %}

To ensure new and existing learners can take advantage of this incredible technology, we are planning on creating a supplementary course in our learner management system that will cover the following items (Fraiwan et al., 2023)[^1]:

- Personalised learning experiences: Tools like ChatGPT can help by suggesting learning resources, addressing student inquiries and offering feedback.
- Code Generation: Like in the previous example above, ChatGPT can help solve coding problems or provide guidance on how to approach a programming problem. The learner can describe a problem in words and/or code snippets to help solve an issue.
- Debugging: Assist in identifying errors and suggesting fixes.

The course will be a mix of documentation on advising on how to write prompts for ChatGPT and video screencast tutorials where teach leads (our industry-aligned name for teachers) in our teaching team will walk through real-life examples and demonstrations on common issues our learners have previously had. Just like learners would have previously learnt how to use a search engine like Google, they will be taught how to interact with ChatGPT and what prompts can elicit different responses. While ChatGPT is a valuable tool, we will also have to remind our learners that it is an early technology tool and not infallible, it still has issues with “hallucinations” of facts that are entirely fabricated, a concept popularised by Google AI researchers (Agarwal et al., 2018)[^2]. Learners must verify answers with reliable sources, official documentation, or via our learner support team.

[GitHub Copilot](https://github.com/features/copilot) is a plugin for [Visual Studio Code](https://code.visualstudio.com), the IDE (integrated development environment) we use at the Developers Institute. It is an extension of a developer's work environment and acts as an AI pair programmer that helps one write code. It does this by prompting suggested code based on the context of your existing code and interpreting code comments. It will show this suggested code in the grey text beside the cursor. If it seems satisfactory, pressing the tab key will embed this suggestion into your code base. The suggestions can be from a simple line to multiple lines, depending on what the AI model predicts you will use. It will also suggest multiple options, generally more than one. If unhappy, use the “Next" suggestion keyboard shortcut. The predictions/suggestions will even use the declared variables in your existing code.

{% figure "./vscode-copilot.png", "Visual Studio Code with GitHub Copilot" %}

The benefits that most developers find when using Copilot are the following:

- Productivity increased: Copilot can improve productivity by providing context-relevant code suggestions when needed. Stopping a developer from needing to switch contexts and having to look up documentation (Peng et al., 2023)[^3].
- Generating tests: When writing code for software development, it is best practice to write tests to ensure your code is working correctly. Often this can be a mind-numbing task doing simple checks to ensure that when two known values are passed to a function, the expected results are always the same every time the function is run. You can ensure this is the case by writing tests (small pieces of code to check) that test the boundaries of happy and negative paths. Copilot is integrated into your IDE, so it is aware of your code's functions. It knows the expected parameters and can generate these small tests, saving lots of time on repetitive coding (Wermelinger, 2023)[^4].

We plan to integrate Copilot with the previously mentioned course with ChatGPT. Again adding screencasts and tutorials on how to make the most of it. This course will be called "Enhancing Development with AI", which we plan to be 2-3 weeks of content and can be completed after our first program in the student's software development journey as a supplementary self-paced online course. That way, existing students and new learners alike can up-skill.

Another great tool that enables collaborative learning between students and teaching staff is [GitHub Codespaces](https://github.com/features/codespaces). It is a cloud-based development environment. It allows you to code as if using Visual Studio Code, in the cloud via a browser (or your local copy of VS Code). There is no need to set up a local environment to install Node.js or Python (or whatever language you require) and necessary dependencies etc.

{% figure "./vscode-codespaces.png", "Visual Studio Code using Codespaces" %}

Some of the benefits of Codespaces are the following (Malan, 2022)[^5]:

- Consistent and accessible coding environment: Regardless of the computing device, it's possible to code on complicated multiple-tier applications from an iPad or Chromebook as the code runs in the cloud.
- Rapid onboarding and sharing: Students and staff can quickly set up and start working on a shared project or exercise in a class without the hassle of setting up a local development environment. The Codespaces can be configured with all tools and dependencies near instantly.
- Collaboration and code review: It's common to support our learners by needing to run their exercise or project to help them debug. We must find their Git repository, clone it locally to our local development environment (computer), and install all the dependencies to provide support. With Codespaces, we can quickly deploy in the cloud and share the same code in seconds.

In the long term, we plan to migrate our existing exercises and projects to use [development containers](https://containers.dev) config files to take advantage of Codespaces, locally or in the cloud. With many exercises to convert, it will take some time to complete.

Finally, we want to embed environmentally sustainable software practises into our course. We want to minimise the impact of software systems on our environment by reducing energy consumption and using green energy, reducing carbon emissions.

There are several ways to do this:

- Green (Cloud) Hosting: Choosing environmentally friendly hosting options. For example, Microsoft is powering their data centres with carbon-zero power and has just signed a 10-year power purchase agreement with Contact Energy to supply geothermal energy (NZX, 2023)[^6].
- Energy efficiency and optimisation: Teach energy-efficient programming practices and techniques where resources are minimised, and we attempt to reduce unnecessary compute time. Thus reducing the energy consumption of servers (Abhishek et al., 2021)[^7].
- Promote reduced cost: By optimising efficiency, the software can require smaller servers to reduce the cost of hosting. The reduced cost benefit is an easy sell to employers.

If each graduate can help make environmentally sustainable efforts for software development in Aotearoa more common, we can get a little closer to our reduction of greenhouse gas emissions goals of 2030, and reduce the impact of climate change.

In conclusion, as a remote school heavily relying on technology, it's important to continue innovating in education to enhance the student's learning experience. We need to educate students in tools like ChatGPT and GitHub Copilot to assist and support them when practising to become software developers. Allowing collaboration and learning to be more accessible to staff and learners by easily sharing their current issue(s) without frustration and hassle using Codespaces. We need them to go into the industry with a good grasp of environmental sustainability concerning software development to help with impending climate change. Incorporating these tools and knowledge into our teaching practices will ensure Developers Institute is at the forefront of digital and collaborative learning.

[^1]: Mohammad Fraiwan, Natheer Khasawneh (2023). A Review of ChatGPT Applications in Education, Marketing, Software Engineering, and Healthcare: Benefits, Drawbacks, and Research Directions. <https://arxiv.org/abs/2305.00237>
[^2]: Agarwal, A., Wong-Fannjiang, C., Sussillo, D., Lee, K., & Firat, O. (2018). Hallucinations in Neural Machine Translation. <https://openreview.net/pdf?id=SkxJ-309FQ>
[^3]: Sida Peng, Eirini Kalliamvakou, Peter Cihon, Mert Demirer. (2023). The Impact of AI on Developer Productivity: Evidence from GitHub Copilot. <https://arxiv.org/abs/2302.06590>
[^4]: Wermelinger, Michel. (2023). Using GitHub Copilot to Solve Simple Programming Problems. <https://doi.org/10.1145/3545945.3569830>
[^5]: David J. Malan. (2022). Standardizing Students’ Programming Environments with Docker Containers. <https://cs.harvard.edu/malan/publications/iticse22.pdf>
[^6]: NZX (2023, May 25). CEN signs 10-year renewable energy agreement with Microsoft NZX. <https://www.nzx.com/announcements/412004>
[^7]: Abhishek D S, Anusha V, Bheemappa, Chaitra B R, Mallesha Holeyache, Vijaykumar, Dr. Sheela S V. (2021). Green Software. <https://www.ijres.org/papers/Volume-9/Issue-8/Series-8/C09081219.pdf>
