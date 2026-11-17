import bpy, math
from pathlib import Path
from mathutils import Vector
project_root = Path(__file__).resolve().parent.parent
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(project_root / 'public/media/column-optimized.glb'))
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
points=[o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
low=Vector(tuple(min(p[i] for p in points) for i in range(3)))
high=Vector(tuple(max(p[i] for p in points) for i in range(3)))
root=bpy.data.objects.new('Column framing',None);bpy.context.collection.objects.link(root)
for o in list(bpy.context.scene.objects):
 if o!=root and o.parent is None: o.parent=root
scale=12.7/(high.z-low.z)
root.scale=(scale,)*3
root.location=-(low+high)*.5*scale
root.location.z-=1.2
root.rotation_euler.z=.08
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.render.film_transparent=True
scene.render.resolution_x=1400;scene.render.resolution_y=1750;scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('Dim studio');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.37,.45,.65,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.065
def sun(name,position,color,power):
 light=bpy.data.lights.new(name,'SUN');light.energy=power;light.color=color;light.angle=.08
 obj=bpy.data.objects.new(name,light);scene.collection.objects.link(obj);obj.location=position
 obj.rotation_euler=(-obj.location).to_track_quat('-Z','Y').to_euler()
sun('Warm backlight',(3,4,5),(1,.26,.08),3.2)
sun('Cool backlight',(-4,2,3),(.19,.37,.86),1.6)
sun('Soft fill',(-5,-12,6),(1,.78,.6),.22)
sun('Warm sculpting edge',(4,-1,3),(1,.25,.05),1.2)
light=bpy.data.lights.new('Cursor light, resting position','AREA');light.energy=500;light.color=(1,.75,.46);light.shape='DISK';light.size=3
obj=bpy.data.objects.new('Cursor light, resting position',light);scene.collection.objects.link(obj);obj.location=(1.8,-4,4)
obj.rotation_euler=(Vector((0,0,3.2))-obj.location).to_track_quat('-Z','Y').to_euler()
camera=bpy.data.cameras.new('Hero camera');obj=bpy.data.objects.new('Hero camera',camera);scene.collection.objects.link(obj)
obj.location=(0,-10,3.4);obj.rotation_euler=(math.pi/2,0,0)
camera.sensor_fit='VERTICAL';camera.sensor_height=32;camera.lens=32/(2*math.tan(math.radians(32)/2));scene.camera=obj
scene.view_settings.view_transform='AgX'
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.render.filepath=str(project_root / 'public/media/column-lit-desktop.png')
bpy.ops.render.render(write_still=True)
