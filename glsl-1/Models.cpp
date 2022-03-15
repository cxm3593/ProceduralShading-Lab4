//
//  Models.cpp
//
//  Assignment-specific code for objects.  This module will typically be
//  heavily modified to fit the needs of each assignment.
//
//  Created by Warren R. Carithers on 2021/09/02.
//  Based on earlier versions created by Joe Geigel and Warren R. Carithers
//  Copyright 2021 Rochester Institute of Technology. All rights reserved.
//
//  This file should not be modified by students.
//

#include <iostream>
#include <cmath>

#if defined(_WIN32) || defined(_WIN64)
#include <windows.h>
#endif

#include "Models.h"

using namespace std;

//
// PRIVATE GLOBALS
//

#include "QuadData.h"

//
// PUBLIC FUNCTIONS
//

///
/// createObject - create our Quad object
///
/// @param C      - the Canvas to use when drawing
///
void createObject( Canvas &C )
{
    for( int i = 0; i < quadElementsLength - 2; i += 3 ) {

        // Calculate the base indices of the three vertices
        int point1 = quadElements[i];
        int point2 = quadElements[i + 1];
        int point3 = quadElements[i + 2];

        Vertex p1 = quadVertices[point1];
        Vertex p2 = quadVertices[point2];
        Vertex p3 = quadVertices[point3];

        // Calculate the surface normals for the three vertices
        Normal n1 = { quadNormals[0], quadNormals[1], quadNormals[2] };
        Normal n2 = n1;
        Normal n3 = n2;

        // Add this triangle to the collection
        C.addTriangleWithNorms( p1, n1, p2, n2, p3, n3 );

        // Add the texture coordinates
        //C.addTextureCoords( quadUV[point1], quadUV[point2], quadUV[point3] );
    }
}
