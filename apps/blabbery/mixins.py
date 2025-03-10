from django.db.models import Model, DateTimeField

class TimeStampMixin(Model):
    """
    Abstract model that provides created_at and updated_at fields.
    """

    created_at = DateTimeField(verbose_name = 'Created At', auto_now_add = True)
    updated_at = DateTimeField(verbose_name = 'Updated At', auto_now_add = True)

    class Meta:
        abstract = True
