#!/bin/bash
ruby -run -e httpd -- --bind-address=0.0.0.0 --port=9292 --do-not-reverse-lookup .
