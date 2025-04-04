from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
    """
    Custom permission to only allow owners of an object to edit it, or admin.
    """
    message = 'You must be the owner of this object.'

    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_staff
        
    def has_object_permission(self, request, view, obj):
        return obj == request.user or request.user.is_staff

class GroupStaffOrAdmin(BasePermission):
    """
    Custom permission to only allow staff or admins to edit a group.
    """
    message = 'You must be a staff member or admin.'

    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_staff
        
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.staff.filter(id=request.user.id).exists()
