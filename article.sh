#!/bin/bash
# A bash script to create a folders with a markdown file ready for a post

DATE="$(date '+%Y-%m-%d')" 
FOLDER="content/articles/$DATE-title" 
FILE="$FOLDER/index.md"
mkdir $FOLDER && touch $FILE && echo "---
title: 
date: '$(date '+%Y-%m-%dT%H:%M:%SZ')'
template: post
draft: true
slug: '$(date '+%Y/%m/%d/')'
category: article
tags:
- 
description: 
--- 
" >> $FILE