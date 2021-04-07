#!/bin/bash
# A bash script to create a folders with a markdown file ready for a post

read -p 'Title: ' BLOGTITLE
read -p 'File title: ' BLOGFILETITLE

DATE="$(date '+%Y-%m-%d')" 
FOLDER="content/blog/$BLOGFILETITLE" 
FILE="$FOLDER/index.md"
mkdir $FOLDER && touch $FILE && echo "---
title: $BLOGTITLE
date: '$(date '+%Y-%m-%dT%H:%M:%SZ')'
template: post
draft: true
slug: '$BLOGFILETITLE'
category: article
tags:
- 
description: 
--- 
" >> $FILE