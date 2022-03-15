//
//  Lighting
//
//  Simple module for setting up the parameters for lighting and shading
//  for this assignment.
//
//  Created by Warren R. Carithers 2019/11/18.
//  Updated: 2021/11/07 by wrc
//  Copyright 2021 Rochester Institute of Technology.  All rights reserved.
//

#include "Lighting.h"

#include "Application.h"
#include "Utils.h"

using namespace std;

// lighting data
static GLfloat lightcolor[4] = {  1.0f,  1.0f,  1.0f, 1.0f };
static GLfloat lightpos[4]   = {  1.0f,  3.0f,  5.0f, 1.0f };
static GLfloat amblight[4]   = {  0.7f,  0.7f,  0.7f, 1.0f };

// data about the object
static GLfloat quad_exp  = 50.0f;
static GLfloat k[3]      = { 1.0f, 1.0f, 1.0f };

///
/// This function sets up the lighting, material, and shading parameters
/// for the shaders.
///
/// @param program  The ID of an OpenGL (GLSL) shader program to which
///    parameter values are to be sent
///
void setLighting( GLuint program )
{
    GLint loc;

    // Lighting parameters
    loc = getUniformLoc( program, "lightPosition" );
    if( loc >= 0 ) {
        glUniform4fv( loc, 1, lightpos );
    }

    loc = getUniformLoc( program, "lightColor" );
    if( loc >= 0 ) {
        glUniform4fv( loc, 1, lightcolor );
    }

    loc = getUniformLoc( program, "specExp" );
    if( loc >= 0 ) {
        glUniform1f( loc, quad_exp );
    }

    loc = getUniformLoc( program, "kCoeff" );
    if( loc >= 0 ) {
        glUniform3fv( loc, 1, k );
    }

    loc = getUniformLoc( program, "ambientLight" );
    if( loc >= 0 ) {
        glUniform4fv( loc, 1, amblight );
    }
}
