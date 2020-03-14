#!/usr/bin/env python

# GIMP Plug-in for Simple SVG Exports

# Copyright (C) 2016 by Dylan Grafmyre <thorsummoner@live.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3 of the License, or
# (at your option) any later version.

# based on an openraster plugin by 
# https://git.gnome.org/browse/gimp/tree/plug-ins/pygimp/plug-ins/file-openraster.py?h=GIMP_2_8_16

import gimpfu

def register_save_handlers():
    gimpfu.gimp.register_save_handler('file-svg-save', 'svg', '')

def save_svg(img, drawable, filename, raw_filename):
    gimpfu.gimp.pdb.gimp_vectors_export_to_file(img, filename, None)

gimpfu.register(
    'file-svg-save', #name
    'save an SVG (.svg) file', #description
    'save an SVG (.svg) file',
    'Dylan Grafmyre', #author
    'Dylan Grafmyre', #copyright
    '2016', #year
    'SVG',
    '*',
    [   #input args. Format (type, name, description, default [, extra])
        (gimpfu.PF_IMAGE, "image", "Input image", None),
        (gimpfu.PF_DRAWABLE, "drawable", "Input drawable", None),
        (gimpfu.PF_STRING, "filename", "The name of the file", None),
        (gimpfu.PF_STRING, "raw-filename", "The name of the file", None),
    ],
    [], #results. Format (type, name, description)
    save_svg, #callback
    on_query = register_save_handlers,
    menu = '<Save>'
)

gimpfu.main()
