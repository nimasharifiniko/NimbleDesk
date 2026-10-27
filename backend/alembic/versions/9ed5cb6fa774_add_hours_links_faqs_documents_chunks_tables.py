import pgvector
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '9ed5cb6fa774'
down_revision: Union[str, None] = '1f3654a8a1ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    op.create_table('business_hours',
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('day_of_week', sa.SmallInteger(), nullable=False),
        sa.Column('open_time', sa.String(length=10), nullable=True),
        sa.Column('close_time', sa.String(length=10), nullable=True),
        sa.Column('is_closed', sa.Boolean(), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_business_hours_business_id'), 'business_hours', ['business_id'], unique=False)

    op.create_table('business_links',
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=100), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('link_type', sa.String(length=50), nullable=False),
        sa.Column('sort_order', sa.SmallInteger(), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_business_links_business_id'), 'business_links', ['business_id'], unique=False)

    op.create_table('documents',
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('file_type', sa.String(length=50), nullable=False),
        sa.Column('file_path', sa.String(length=500), nullable=True),
        sa.Column('is_processed', sa.Boolean(), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_documents_business_id'), 'documents', ['business_id'], unique=False)

    op.create_table('faqs',
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('question', sa.Text(), nullable=False),
        sa.Column('answer', sa.Text(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_faqs_business_id'), 'faqs', ['business_id'], unique=False)

    op.create_table('chunks',
        sa.Column('business_id', sa.UUID(), nullable=False),
        sa.Column('document_id', sa.UUID(), nullable=True),
        sa.Column('faq_id', sa.UUID(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('embedding', pgvector.sqlalchemy.Vector(768), nullable=True),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['faq_id'], ['faqs.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_chunks_business_id'), 'chunks', ['business_id'], unique=False)
    op.create_index(op.f('ix_chunks_document_id'), 'chunks', ['document_id'], unique=False)
    op.create_index(op.f('ix_chunks_faq_id'), 'chunks', ['faq_id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_chunks_faq_id'), table_name='chunks')
    op.drop_index(op.f('ix_chunks_document_id'), table_name='chunks')
    op.drop_index(op.f('ix_chunks_business_id'), table_name='chunks')
    op.drop_table('chunks')

    op.drop_index(op.f('ix_faqs_business_id'), table_name='faqs')
    op.drop_table('faqs')

    op.drop_index(op.f('ix_documents_business_id'), table_name='documents')
    op.drop_table('documents')

    op.drop_index(op.f('ix_business_links_business_id'), table_name='business_links')
    op.drop_table('business_links')

    op.drop_index(op.f('ix_business_hours_business_id'), table_name='business_hours')
    op.drop_table('business_hours')
