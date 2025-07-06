#!/bin/bash
# A bash script to create a folders with a markdown file ready for a note

read -p 'Title: ' NOTETITLE

NOTEID="$(date '+%Y%m%d%H%M')"
FOLDER="content/notes/$NOTEID"
FILE="$FOLDER/index.md"
mkdir $FOLDER && touch $FILE && echo "---
title: $NOTETITLE
date: '$(date '+%Y-%m-%dT%H:%M:%SZ')'
template: post
draft: true
slug: '$NOTEID'
category: note
tags:
- 
description: 
--- 
" >> $FILE